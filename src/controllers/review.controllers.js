import { asyncHandler } from "../utils/asyncHandler.js";
import Review from "../models/review.model.js";
import Listing from "../models/listing.model.js";

const createReview = asyncHandler(async (req, res) => {
  const { id: listingId } = req.params;
  const newReview = req.body;
  newReview.author = req.user._id;
  const review = new Review(newReview);

  const listing = await Listing.findById(listingId);

  listing.reviews.push(review);
  listing.save();
  review.save().then((data) => {
    req.flash("success", "Review created successfully!");
    res.redirect(`/listings/${listingId}`);
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { id: listingId, reviewId } = req.params;
  await Listing.findByIdAndUpdate(listingId, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId).then(() => {
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${listingId}`);
  });
});

export { createReview, deleteReview };
