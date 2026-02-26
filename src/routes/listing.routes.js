import { Router } from "express";
import { joiListingSchema } from "../validations/validator.js";
import { validate } from "../middlewares/validate.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { listingOwner } from "../middlewares/auth.middlewares.js";
import {
  newListing,
  createListing,
  listingIndex,
  showListing,
  editListing,
  updateListing,
  deleteListing,
} from "../controllers/listing.controllers.js";

const listingRouter = Router();

// Render create listing form:
listingRouter.route("/new").get(isLoggedIn, newListing);

// Index and Create Route:
listingRouter
  .route("/")
  .get(listingIndex)
  .post(isLoggedIn, validate(joiListingSchema, "body"), createListing);

// Render Edit Form:
listingRouter.route("/:id/edit").get(isLoggedIn, listingOwner, editListing);

// Show, Update and Destroy Route
listingRouter
  .route("/:id")
  .get(showListing)
  .patch(
    isLoggedIn,
    listingOwner,
    validate(joiListingSchema, "body"),
    updateListing,
  )
  .delete(isLoggedIn, listingOwner, deleteListing);

export { listingRouter };
