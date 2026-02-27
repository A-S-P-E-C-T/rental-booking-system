import mongoose from "mongoose";
import Review from "./review.model.js";
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    imageUrl: {
      type: String,
      required: true,
    },
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (deletedListing) => {
  if (deletedListing) {
    await Review.deleteMany({ _id: { $in: deletedListing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
