import { Request, Response, NextFunction } from "express";

import { response } from "../utils/responseHandler";

export const requireFreelancer = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.role !== "freelancer" &&
    req.role !== "admin" &&
    req.role !== "super-admin"
  ) {
    return response(res, 403, "Freelancer access required");
  }

  next();
};
