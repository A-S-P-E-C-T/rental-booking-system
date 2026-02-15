import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in the .env file.");
    }
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(console.log("Connected to DB"));
  } catch (error) {
    console.error("Connection to DB failed");
    throw error;
  }
};

export { connectDB };
