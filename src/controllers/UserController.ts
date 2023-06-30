
import { Request, Response } from "express";
import UserService from '../services/UserService';
import Validator from "../models/Validator";
import sendResponse from '../services/ResponseService';


export default {
    signup: async (req: Request, res: Response)  => {
        const { error, value } = Validator.validateUser(req.body);
        if (error) {
            return sendResponse(req, res, 400, error.details[0].message);
        }
        
        const response = await UserService.signup(req);
        if (!response) {
          return sendResponse(req, res, 400, "User registration failed");
        }
  
        if (!response.success) {
          return sendResponse(req, res, 400, "User signup attempt", response);
        }
  
        return sendResponse(req, res, 200, "User signup attempt", response);

    },

    getAllUsers: async (req: Request, res: Response) => {
      try {
        const response = await UserService.getAllUsers();        
        if (!response) {
          return sendResponse(req, res, 404, "Users not found");
        }

        return sendResponse(req, res, 200, "Users fetched seuccessfully", response);
      } catch (err) {
        console.log(`Error while fetching users: ${err}`);
        sendResponse(req, res, 500, `An error occured while processing this request: ${err}`);
      }
    },

    getUserById: async (req: Request, res: Response) => {
      try {
        const { userId } = req.params;
        const response = await UserService.getUserById(userId);
        if (!response) {
          return sendResponse(req, res, 404, "User not found");
        }

        return sendResponse(req, res, 200, "User fetched seuccessfully", response);
      } catch (err) {
        console.log(`Error while fetching user: ${err}`);
        sendResponse(req, res, 500, `An error occured while processing this request: ${err}`);
      }
    },

    updateUser: async (req: Request, res: Response) => {
      try {
        await UserService.updateUser(req, res);
        
        return sendResponse(req, res, 200, "User updated successfully");
      } catch (err) {
        console.log(`Error while updating user: ${err}`);
        sendResponse(req, res, 500, `An error occured while processing this request: ${err}`);
      }
    },

    requestApprovalOtp: async (req: Request, res: Response) => {
        const { email } = req.params;        
        try {
          const response = await UserService.requestVerificationOtp(email);
          return sendResponse(req, res, 200, "OTP request made", response);
        } catch (err) {
          console.error(`${email} OTP request failed: ${err}`);
          sendResponse(req, res, 500, "Could not process user verification OTP");
        }
    },

    verifyUser: async (req: Request, res: Response) => {
      try {
        const response = await UserService.verifyUser(req);
        if (!response) {
          return sendResponse(req, res, 400, "User verification failed");
        }

        if (!response.success) {
          return sendResponse(req, res, 400, "User verification request made", response);
        }

        return sendResponse(req, res, 200, "User verification request made", response);
      } catch (err) {
        console.log(`Error while fetching users: ${err}`);
        sendResponse(req, res, 500, `An error occured while processing this request: ${err}`);
      }
    },

    userLogin: async (req: Request, res: Response) => {
      const response = await UserService.userLogin(req);
      if (!response) {
        return sendResponse(req, res, 400, "User login failed");
      }

      if (!response.success) {
        return sendResponse(req, res, 400, "User login attempt", response);
      }

      return sendResponse(req, res, 200, "User login attempt", response);
    }
};
