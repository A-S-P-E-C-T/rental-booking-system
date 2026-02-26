import Joi from "joi";

const joiListingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().uri().required(),
  price: Joi.number().integer().min(1).max(5).required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
});

const joiReviewSchema = Joi.object({
  ratedStars: Joi.number().positive().required(),
  comment: Joi.string().required(),
});

const joiUserSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().lowercase().required(),
  password: Joi.string().required(),
});

export { joiListingSchema, joiReviewSchema, joiUserSchema };
