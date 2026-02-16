import { Router } from "express";
import { joiReviewSchema } from "../validations/validator.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Review } from "../models/review.model.js";
import Listing from "../models/listing.model.js";

const reviewRouter = Router({ mergeParams: true });

// Create Route:

reviewRouter.route("/create").post(
  validate(joiReviewSchema, "body"),
  asyncHandler(async (req, res) => {
    const { id: listingId } = req.params;
    const newReview = req.body;
    const review = new Review(newReview);

    const listing = await Listing.findById(listingId);

    listing.reviews.push(review);
    listing.save();

    review.save().then((data) => {
      res.redirect(`/listings/${listingId}`);
    });
  }),
);

export { reviewRouter };
