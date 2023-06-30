import express from "express";
import basicAuth from "../middlewares/BasicAuth";

const router = express.Router();

import UserController from "../controllers/UserController";

router.post("/user", basicAuth, UserController.signup);
router.get("/user", basicAuth, UserController.getAllUsers);
router.get("/user/:userId", basicAuth, UserController.getUserById);
router.put("/user/:userId", basicAuth, UserController.updateUser);
router.post("/user/request-otp/:email", basicAuth, UserController.requestApprovalOtp);
router.post("/user/verify/:email", basicAuth, UserController.verifyUser);
router.post("/user/login", basicAuth, UserController.userLogin);

export default router;
