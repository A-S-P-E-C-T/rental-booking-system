import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import path from "path";
import { fileURLToPath } from "url"; // Because ES module does not support __dirname and __filename
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { asyncHandler } from "./utils/asyncHandler.js";
import { ApiError } from "./utils/apiError.js";
import { joiListingSchema } from "./validations/listing.validation.js";
import { validate } from "./middlewares/validate.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

// Home Route:
app.get("/", (req, res) => {
  res.send("Root is workng!");
});

// Test Listing:
app.get(
  "/testListing",
  asyncHandler(async (req, res) => {
    let sampleListing = new Listing({
      title: "My New Villa",
      description: "By the Beach",
      price: 1200,
      location: "Goa",
      country: "India",
    });

    await sampleListing.save().then(() => {
      res.send("Testing successful");
    });
  }),
);

// New Route:
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create Route:
app.post(
  "/listings",
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
app.get(
  "/listings",
  asyncHandler(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);

// Show Route:
app.get(
  "/listings/:id",
  asyncHandler(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  }),
);

// Edit Route:
app.get(
  "/listings/:id/edit",
  asyncHandler(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ApiError(400, "No listing found!");
    }
    res.render("listings/edit.ejs", { listing });
  }),
);

// Update Route:
app.patch(
  "/listings/:id",
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
app.delete(
  "/listings/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

app.use((req, res, next) => {
  next(new ApiError(400, "Page not found!"));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).render("errors/error.ejs", { err });
});

app.listen(port, "0.0.0.0.", () => {
  console.log(`Server is listening to port ${port}`);
});
