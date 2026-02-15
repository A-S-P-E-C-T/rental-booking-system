const errorHandler = (err, req, res, next) => {
  res.render("templates/errors/error.ejs", { err });
};

export { errorHandler };
