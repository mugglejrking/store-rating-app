const Joi = require('joi');

const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

const userSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordPattern).required().messages({
    'string.pattern.base': 'Password must be 8-16 characters, include at least one uppercase letter and one special character',
  }),
  address: Joi.string().max(400).allow('', null),
  role: Joi.string().valid('admin', 'normal_user', 'store_owner').required(),
});

const signupSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordPattern).required().messages({
    'string.pattern.base': 'Password must be 8-16 characters, include at least one uppercase letter and one special character',
  }),
  address: Joi.string().max(400).allow('', null),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().pattern(passwordPattern).required().messages({
    'string.pattern.base': 'New password must be 8-16 characters, include at least one uppercase letter and one special character',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const storeSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).allow('', null),
  owner_id: Joi.number().integer().required(),
});

const ratingSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  store_id: Joi.number().integer().required(),
  rating_value: Joi.number().integer().min(1).max(5).required(),
});

const rateSchema = Joi.object({
  rating_value: Joi.number().integer().min(1).max(5).required(),
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateChangePassword = (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateStore = (req, res, next) => {
  const { error } = storeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateRating = (req, res, next) => {
  const { error } = ratingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateRate = (req, res, next) => {
  const { error } = rateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateUser,
  validateSignup,
  validateChangePassword,
  validateLogin,
  validateStore,
  validateRating,
  validateRate,
};
