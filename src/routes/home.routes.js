import { Router } from "express";

const homeRouter = Router();

// Home Route:
homeRouter.route("/").get((req, res) => {
  res.send("Root is workng!");
});

export { homeRouter };
