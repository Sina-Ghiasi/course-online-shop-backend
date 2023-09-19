import joi from "joi";

export const registerUserValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(6).required(),
    email: joi.string().email().min(6).required(),
    phoneNumber: joi.string().required(),
    password: joi.string().min(8).required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      message: error.details[0].message,
    });

  next();
};

export const loginUserValidation = (req, res, next) => {
  const schema = joi.object({
    phoneNumber: joi.string().required(),
    password: joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      message: error.details[0].message,
    });

  next();
};

export const resetPassValidation = (req, res, next) => {
  const schema = joi.object({
    newPassword: joi.string().required(),
    userId: joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      message: error.details[0].message,
    });

  next();
};

export const otpViaSmsGenerateValidation = (req, res, next) => {
  const schema = joi.object({
    phoneNumber: joi.string().required(),
    type: joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      message: error.details[0].message,
    });

  next();
};

export const otpViaSmsVerifyValidation = (req, res, next) => {
  const schema = joi.object({
    otp: joi.string().required(),
    phoneNumber: joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      message: error.details[0].message,
    });

  next();
};

export const createProductValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required(),
    summary: joi.string().allow(""),
    description: joi.string().allow(""),
    image: joi.string().allow(""),
    price: joi.number().required(),
    discount: joi.number().optional(),
    spotPlayerId: joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      message: error.details[0].message,
    });

  next();
};

export const updateProductValidation = (req, res, next) => {
  const schema = joi.object({
    productId: joi.string().required(),
    name: joi.string().required(),
    summary: joi.string().allow(""),
    description: joi.string().allow(""),
    image: joi.string().allow(""),
    price: joi.number().required(),
    discount: joi.number().optional(),
    spotPlayerId: joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      message: error.details[0].message,
    });

  next();
};

export const getOrderBetweenValidation = (req, res, next) => {
  const schema = joi.object({
    lt: joi.number().required(),
    gt: joi.number().required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      message: error.details[0].message,
    });

  next();
};

export const makeOrderValidation = (req, res, next) => {
  const schema = joi.object({
    phoneNumber: joi.string().required(),
    productIds: joi.array().items(joi.string()),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      message: error.details[0].message,
    });

  next();
};
