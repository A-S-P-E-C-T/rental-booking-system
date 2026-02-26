import { Router } from "express";
import { joiReviewSchema } from "../validations/validator.js";
import { validate } from "../middlewares/validate.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { reviewAuthor } from "../middlewares/auth.middlewares.js";
import {
  createReview,
  deleteReview,
} from "../controllers/review.controllers.js";

const reviewRouter = Router({ mergeParams: true });

// Create Route:
reviewRouter
  .route("/create")
  .post(isLoggedIn, validate(joiReviewSchema, "body"), createReview);

// Destroy Route:
reviewRouter
  .route("/:reviewId/delete")
  .delete(isLoggedIn, reviewAuthor, deleteReview);

export { reviewRouter };
