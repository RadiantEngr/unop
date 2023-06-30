import auth from "basic-auth";
import config from "../config";
import sendResponse from "../services/ResponseService";
import { Request, Response, NextFunction } from "express";

const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const user = auth(req); 
  if (!user || user.name !== config.basicAuth.user || user.pass !== config.basicAuth.password) {
    return sendResponse(req, res, 401, "Invalid credentials");
  } else {
    next();
  }
};

export default basicAuth;
