import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

const renderSignupForm = (req, res) => {
  res.render("templates/user/signup");
};

const signupUser = asyncHandler(async (req, res) => {
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
});

const renderLoginForm = (req, res) => {
  res.render("templates/user/login");
};

const loginUser = asyncHandler(async (req, res) => {
  req.flash("success", "Welcome back to WanderPad");
  res.redirect(res.locals.redirectUrl || "/listings");
});

const logoutUser = (req, res) => {
  req.logout((error) => {
    if (error) {
      next(err);
    }
    req.flash("success", "You are logged out of WonderPad");
    res.redirect("/listings");
  });
};

export { renderSignupForm, signupUser, renderLoginForm, loginUser, logoutUser };
