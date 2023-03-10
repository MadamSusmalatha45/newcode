const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const RiskAssessmentReportSchema = new mongoose.Schema({
  userId : {
    type: mongoose.Schema.ObjectId,
    ref : 'User',
    required: true,
  },
  siteId : {
    type: mongoose.Schema.ObjectId,
    ref : 'Site',
    required: true,
  },
  riskAssessmentCategoryId: {
    type: mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentCategory',
    required: true,
  },
  riskAssessmentQuestionId: {
    type: mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentQuestion',
    required: true,
  },
  choiceId : {
    type: mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentQuestionChoice',
    required: true,
  },
  optionId : {
    type : mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentChoiceOption',
    required: true,
  },
  answer: {
    type : String,
    required : true
  },
  rating : {
    type : String,
    required : true,
    enum : ['High','Low'],
    default : 'Low'
  },
  media : {
    type : String,
    default : null,
    required : false
  },
  note : {
    type : String,
    required : true,
    default  : null
  }
}, {
  timestamps: true,
});


RiskAssessmentReportSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id','userId','siteId','riskAssessmentCategoryId', 'riskAssessmentQuestionId','choiceId','optionId','answer','rating','media','createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


RiskAssessmentReportSchema.statics = {
  async get(id) {
    let report;

    if (mongoose.Types.ObjectId.isValid(id)) {
        report = await this.findById(id).populate('userId siteId riskAssessmentCategoryId riskAssessmentQuestionId choiceId optionId').exec();
    }
    if (report) {
      return report;
    }

    throw new APIError({
      message: 'Risk assessment report does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 30,  riskAssessmentCategoryId, riskAssessmentQuestionId
  }) {
    const options = omitBy({ riskAssessmentCategoryId, riskAssessmentQuestionId}, isNil);

    return this.find(options)
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
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('RiskAssessmentReport', RiskAssessmentReportSchema,'risk_assessment_reports');
