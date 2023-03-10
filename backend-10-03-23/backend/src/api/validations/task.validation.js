const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listTasks: {
    query: {
    //   checkIn: Joi.date().iso().required(),
    //   checkOut: Joi.date().iso().required(),
    //   statusId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    //   userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/Statuss
  createTask: {
    body: {
      companyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      siteId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      title: Joi.string().min(3).required(),
      startDate: Joi.string().min(10).required(),
      endDate: Joi.string().min(10).required(),
      timeDue: Joi.string().min(2).required(),
      description: Joi.string().min(10).required(),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceTask: {
    body: {
      companyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      siteId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      title: Joi.string().min(3).required(),
      startDate: Joi.string().min(10).required(),
      endDate: Joi.string().min(10).required(),
      timeDue: Joi.string().min(2).required(),
      description: Joi.string().min(10).required(),
    },
    params: {
      taskId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateTask: {
    body: {
      companyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      siteId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      title: Joi.string().min(3).required(),
      startDate: Joi.string().min(10).required(),
      endDate: Joi.string().min(10).required(),
      timeDue: Joi.string().min(2).required(),
      description: Joi.string().min(10).required(),
    },
    params: {
      taskId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
