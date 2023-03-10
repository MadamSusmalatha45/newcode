const httpStatus = require('http-status');
const { omit } = require('lodash');
const Report = require('../models/risk.assessment.report.model');
const multer = require('multer');


exports.load = async (req, res, next, id) => {
  try {
    const report = await Report.get(id);
    req.locals = { report };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = async(req, res) => {
    let report = await Report.findOne({_id : req.params.reportId})
                 .populate([
                  {
                    path : 'userId',
                    select : 'firstname lastname'
                  },
                  {
                    path : 'siteId',
                    select : 'name'
                  },
                  {
                    path : 'riskAssessmentCategoryId',
                    select : 'name'
                  },
                  {
                    path : 'riskAssessmentQuestionId',
                    select : 'question' 
                  },
                  {
                    path : 'choiceId',
                    select : 'name'
                  },
                  {
                    path : 'optionId',
                    select : 'name'
                  }
                 ])
    res.json({code: 200, message: 'Risk assessment report retrieved successfully.', data: report.transform()})
};

const storage = multer.diskStorage({
destination(req, file, cb) {
    cb(null, 'uploads/');
},

// By default, multer removes file extensions so let's add them back
filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
},
});


exports.create = async (req, res, next) => {
  try {
    const { riskAssessmentCategoryId, riskAssessmentQuestionId, optionId, choiceId, answer} = req.body;
    if(!riskAssessmentCategoryId){
        res.send(404, {code: 404, message: 'Risk assessment category required!', data: {}});
    }
    else if(!riskAssessmentQuestionId){
        res.send(404 ,{code: 404, message: 'Risk assessment question is required!', data: {}});
    }
    else if(!choiceId){
        res.send(404 ,{code: 404, message: 'Choice is required!', data: {}});
    }
    else if(!optionId){
      res.send(404 ,{code: 404, message: 'Option is required!', data: {}});
    }
    else if(!answer){
        res.send(404 ,{code: 404, message: 'Answer is required!', data: {}});
    }


    var options = {};
    req.body.userId = req.user._id;
    var payload = req.body

    
    const upload = multer({ storage }).single('picture');

    if(req.files !== undefined || req.files !== null){
        const report = new Report(payload);
        const savedReport = await report.save();
        upload(req, res, async (err) => {
          if (req.fileValidationError) {
            return res.send(400, { code: 400, message: 'Invalid file type', errors: req.fileValidationError });
          }
          else if (!req.files) {
            return res.send(400, { code: 400, message: 'Please select an image to upload' });
          }
          else if (err instanceof multer.MulterError) {
            return res.status(500).send({ code: 500, message: `Could not upload the file: ${req.file.originalname}. ${err}` });
          }
          else{
            const baseUrl = `${req.protocol}://${req.headers.host}`;
             var media = `${baseUrl}/uploads/${req.files.picture[0].filename}`
          
           
    
            let report = await Report.updateOne({_id : savedReport._id}, {media : media});
            let getReport = await Report.findOne({_id : savedReport._id});

            res.status(httpStatus.CREATED);
            res.json({code: 201, message: 'Risk assessment report created successfully.', data: getReport.transform()});
          }
        });
    }
    else{
       res.status(httpStatus.CREATED);
       res.json({code: 201, message: 'Risk assessment report created successfully.', data: savedReport.transform()});
    }
    
  } catch (error) {
    next(error);
  }
};

exports.update = async(req, res, next) => {
  const report = await Report.updateOne({_id : req.params.reportId}, req.body)
    .then(async(report) => {
        let newReport = await Question.findOne({_id : req.params.reportId})
        res.json({code : 200, message : 'Risk assessment report updated successfully.', data: newReport.transform()})
    })
    .catch((e) => next(e));
};


exports.list = async (req, res, next) => {
  try {
    if(req.user.login_as === 'user'){
        req.body.userId = req.user._id;
    }
    const reports = await Report.list(req.query);
    const transformedReports = reports.map((status) => status.transform());
    res.json({code : 200, message : 'Risk assessment question list retrieved successfully.', data: transformedReports});
  } catch (error) {
    next(error);
  }
};


exports.remove = async(req, res, next) => {
    Report.deleteOne({_id : req.params.reportId})
    .then(async () => {
        res.json({code : 200, message : 'Risk assessment report delete successfully.', data : {}})
    })
    .catch((e) => next(e));
};
