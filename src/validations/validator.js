import Joi from "joi";

const joiListingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().uri().required(),
  price: Joi.number().positive().required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
});

export { joiListingSchema };
