import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  ratedStars: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const Review = mongoose.model("Review", reviewSchema);

export { Review };
