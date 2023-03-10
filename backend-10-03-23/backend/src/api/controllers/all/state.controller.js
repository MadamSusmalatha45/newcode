const Country = require('../../models/country.model');
const State = require('country-state-city').State;
/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const country = await Country.get(id);
    req.locals = { country };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const states = State.getStatesOfCountry(req.query.country)
    res.json({code : 200, message : 'Country list retrieved successfully.', data: states});
  } catch (error) {
    next(error);
  }
};
