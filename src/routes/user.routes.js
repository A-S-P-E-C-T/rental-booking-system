import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { joiUserSchema } from "../validations/validator.js";
import { validate } from "../middlewares/validate.js";
import User from "../models/user.model.js";
import passport from "passport";
import { saveRedirectUrl } from "../middlewares/auth.middlewares.js";

const userRouter = Router();

userRouter
  .route("/signup")
  .get((req, res) => {
    res.render("templates/user/signup");
  })
  .post(
    validate(joiUserSchema, "body"),
    asyncHandler(async (req, res) => {
      try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (error) => {
          if (error) {
            return next(error);
          }
          req.flash("success", "Welcome to WanderPad");
          res.redirect("/listings");
        });
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
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    asyncHandler(async (req, res) => {
      req.flash("success", "Welcome back to WanderPad");
      res.redirect(res.locals.redirectUrl || "/listings");
    }),
  );

userRouter.route("/logout").get((req, res) => {
  req.logout((error) => {
    if (error) {
      next(err);
    }
    req.flash("success", "You are logged out of WonderPad");
    res.redirect("/listings");
  });
});

export default userRouter;
