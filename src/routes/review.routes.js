import { Router } from "express";
import { joiReviewSchema } from "../validations/validator.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Review } from "../models/review.model.js";
import Listing from "../models/listing.model.js";
import isLoggedIn from "../middlewares/authenticate.middlewares.js";

const reviewRouter = Router({ mergeParams: true });

// Create Route:

reviewRouter.route("/create").post(
  isLoggedIn,
  validate(joiReviewSchema, "body"),
  asyncHandler(async (req, res) => {
    const { id: listingId } = req.params;
    const newReview = req.body;
    const review = new Review(newReview);

    const listing = await Listing.findById(listingId);

    listing.reviews.push(review);
    listing.save();

    review.save().then((data) => {
      req.flash("success", "Review created successfully!");
      res.redirect(`/listings/${listingId}`);
    });
  }),
);

reviewRouter.route("/:reviewId/delete").delete(
  isLoggedIn,
  asyncHandler(async (req, res) => {
    const { id: listingId, reviewId } = req.params;
    await Listing.findByIdAndUpdate(listingId, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId).then(() => {
      req.flash("success", "Review deleted successfully!");
      res.redirect(`/listings/${listingId}`);
    });
  }),
);

export { reviewRouter };
