import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { joiReviewSchema } from "../validations/validator.js";
import { validate } from "../middlewares/validate.js";
import User from "../models/user.model.js";
import passport from "passport";

const userRouter = Router();

userRouter
  .route("/signup")
  .get((req, res) => {
    res.render("templates/user/signup");
  })
  .post(
    asyncHandler(async (req, res) => {
      try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.flash("success", "Welcome to WanderPad");
        res.redirect("/listings");
      } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
      }
    }),
  );

userRouter
  .route("/login")
  .get((req, res) => {
    res.render("templates/user/login");
  })
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    asyncHandler(async (req, res) => {
      req.flash("success", "Welcome back to WanderPad");
      res.redirect("/listings");
    }),
  );

export default userRouter;
