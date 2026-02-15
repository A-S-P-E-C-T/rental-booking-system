import { Router } from "express";
import { joiListingSchema } from "../validations/validator.js";
import { validate } from "../middlewares/validate.js";
import Listing from "../models/listing.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const listingRouter = Router();

// New Route:
listingRouter.route("/new").get((req, res) => {
  res.render("templates/listings/new.ejs");
});

// Create Route:
listingRouter.route("/").post(
  validate(joiListingSchema, "body"),
  asyncHandler(async (req, res) => {
    const newListing = req.body;
    const listing = new Listing(newListing);
    listing.save().then((data) => {
      res.redirect("/listings");
    });
  }),
);

// Index Route:
listingRouter.route("/").get(
  asyncHandler(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("templates/listings/index.ejs", { allListings });
  }),
);

// Show Route:
listingRouter.route("/:id").get(
  asyncHandler(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("templates/listings/show.ejs", { listing });
  }),
);

// Edit Route:
listingRouter.route("/:id/edit").get(
  asyncHandler(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ApiError(400, "No listing found!");
    }
    res.render("templates/listings/edit.ejs", { listing });
  }),
);

// Update Route:
listingRouter.route("/:id").patch(
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

    const listing = await Listing.findByIdAndUpdate(
      id,
      {
        $set: updates,
      },
      {
        runValidators: true,
        new: true,
      },
    );
    res.redirect(`/listings/${id}`);
  }),
);

// Delete Route:
listingRouter.route("/:id").delete(
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

export { listingRouter };
