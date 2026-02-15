import { ApiError } from "../utils/apiError.js";

const notFoundHandler = (req, res, next) => {
  next(new ApiError(400, "Page not found!"));
};

export { notFoundHandler };
