import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/database.js";

dotenv.config();

(async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;

    app.listen(port, "0.0.0.0.", () => {
      console.log(`Server is listening to port ${port}`);
    });
  } catch (error) {
    console.error("FAILED to start server: ", error);
    process.exit(1);
  }
})();
