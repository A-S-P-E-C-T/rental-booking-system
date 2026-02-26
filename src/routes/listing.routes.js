import { Router } from "express";
import { joiListingSchema } from "../validations/validator.js";
import { validate } from "../middlewares/validate.js";
import Listing from "../models/listing.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { listingOwner } from "../middlewares/auth.middlewares.js";
import Review from "../models/review.model.js";

const listingRouter = Router();

// New Route:
listingRouter.route("/new").get(isLoggedIn, (req, res) => {
  return res.render("templates/listings/new.ejs");
});

// Create Route:
listingRouter.route("/").post(
  isLoggedIn,
  validate(joiListingSchema, "body"),
  asyncHandler(async (req, res) => {
    const newListing = req.body;
    newListing.owner = req.user._id;
    const listing = new Listing(newListing);
    listing.save().then((data) => {
      req.flash("success", "Listing created successfully!");
      return res.redirect("/listings");
    });
  }),
);

// Index Route:
listingRouter.route("/").get(
  asyncHandler(async (req, res) => {
    const allListings = await Listing.find({});
    return res.render("templates/listings/index.ejs", { allListings });
  }),
);

// Show Route:
listingRouter.route("/:id").get(
  asyncHandler(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      });

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    return res.render("templates/listings/show.ejs", { listing });
  }),
);

// Edit Route:
listingRouter.route("/:id/edit").get(
  isLoggedIn,
  listingOwner,
  asyncHandler(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    return res.render("templates/listings/edit.ejs", { listing });
  }),
);

// Update Route:
listingRouter.route("/:id").patch(
  isLoggedIn,
  listingOwner,
  validate(joiListingSchema, "body"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, image, price, location, country } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (image) updates.image = image;
    if (price) updates.price = price;
    if (location) updates.location = location;
    if (country) updates.country = country;

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        $set: updates,
      },
      {
        runValidators: true,
        new: true,
      },
    );
    req.flash("success", "Listing updated successfully!");
    return res.redirect(`/listings/${id}`);
  }),
);

// Delete Route:
listingRouter.route("/:id").delete(
  isLoggedIn,
  listingOwner,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Listing.findOneAndDelete({ _id: id });
    req.flash("success", "Listing deleted successfully!");
    return res.redirect("/listings");
  }),
);

export { listingRouter };
