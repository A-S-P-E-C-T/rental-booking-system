const showFlash = (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  return next();
};

export { showFlash };
