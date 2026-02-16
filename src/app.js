import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Because ES module does not support __dirname and __filename
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));

import { listingRouter } from "./routes/listing.routes.js";
import { homeRouter } from "./routes/home.routes.js";
import { reviewRouter } from "./routes/review.routes.js";

app.use("/", homeRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
