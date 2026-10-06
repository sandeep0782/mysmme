import { Request, Response, NextFunction } from "express";
import { response } from "../utils/responseHandler";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("SEARCH USERS CONTROLLER HIT");

  if (req.role !== "admin" && req.role !== "super-admin") {
    return response(res, 403, "Admin access required");
  }

  next();
};
