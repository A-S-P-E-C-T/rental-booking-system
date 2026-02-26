import Listing from "../models/listing.model.js";
import Review from "../models/review.model.js";

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    }
    req.flash("error", "Please log in to continue.");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const listingOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ApiError(400, "Listing not found.");
  }
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing.");
    return res.redirect(`/listings/${listing._id}`);
  }
  next();
};

const reviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(400, "Review not found.");
  }
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

export { isLoggedIn, saveRedirectUrl, listingOwner, reviewAuthor };
