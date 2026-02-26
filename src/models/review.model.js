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
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
