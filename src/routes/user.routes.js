import { Router } from "express";
import { joiUserSchema } from "../validations/validator.js";
import { validate } from "../middlewares/validate.js";
import passport from "passport";
import { saveRedirectUrl } from "../middlewares/auth.middlewares.js";
import {
  renderSignupForm,
  signupUser,
  renderLoginForm,
  loginUser,
  logoutUser,
} from "../controllers/user.controllers.js";

const userRouter = Router();

// Create Route:
userRouter
  .route("/signup")
  .get(renderSignupForm)
  .post(validate(joiUserSchema, "body"), signupUser);

// Login Route:
userRouter
  .route("/login")
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    loginUser,
  );

// Logout Route:
userRouter.route("/logout").get(logoutUser);

export default userRouter;
