import Listing from "../models/listing.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const newListing = (req, res) => {
  return res.render("templates/listings/new.ejs");
};

const createListing = asyncHandler(async (req, res) => {
  const newListing = req.body;
  newListing.owner = req.user._id;
  const listing = new Listing(newListing);
  listing.save().then((data) => {
    req.flash("success", "Listing created successfully!");
    return res.redirect("/listings");
  });
});

const listingIndex = asyncHandler(async (req, res) => {
  const allListings = await Listing.find({});
  return res.render("templates/listings/index.ejs", { allListings });
});

const showListing = asyncHandler(async (req, res) => {
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
});

const editListing = asyncHandler(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  return res.render("templates/listings/edit.ejs", { listing });
});

const updateListing = asyncHandler(async (req, res) => {
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
});

const deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Listing.findOneAndDelete({ _id: id });
  req.flash("success", "Listing deleted successfully!");
  return res.redirect("/listings");
});

export {
  newListing,
  createListing,
  listingIndex,
  showListing,
  editListing,
  updateListing,
  deleteListing,
};
