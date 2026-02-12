import { ApiError } from "../utils/apiError.js";
const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(
        new ApiError(
          400,
          error.details.map((detail) => detail.message).join(", "),
        ),
      );
    }
    req[property] = value;
    next();
  };
};

export { validate };
