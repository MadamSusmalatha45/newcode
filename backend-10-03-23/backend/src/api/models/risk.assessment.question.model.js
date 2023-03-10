const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const RiskAssessmentQuestionSchema = new mongoose.Schema({
  riskAssessmentCategoryId: {
    type: mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentCategory',
    required: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  choices: [{
    type: mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentQuestionChoice',
    required: true,
  }],
}, {
  timestamps: true,
});


RiskAssessmentQuestionSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id','riskAssessmentCategoryId','question','choices','createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


RiskAssessmentQuestionSchema.statics = {
  async get(id) {
    let question;

    if (mongoose.Types.ObjectId.isValid(id)) {
      question = await this.findById(id).populate('riskAssessmentCategoryId choices').exec();
    }
    if (question) {
      return question;
    }

    throw new APIError({
      message: 'Question does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 30,  riskAssessmentCategoryId , options
  }) {
    const option = omitBy({ riskAssessmentCategoryId, options}, isNil);

    return this.find(option)
      .populate([
        {
          path : 'riskAssessmentCategoryId',
          select : "name"
        }
        ,
        {
          path : 'choices',
          model : 'RiskAssessmentQuestionChoice',
          select : "options name",
          populate : {
            path : 'options',
            select : 'name'
          }
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },



};

module.exports = mongoose.model('RiskAssessmentQuestion', RiskAssessmentQuestionSchema,'risk_assessment_questions');
