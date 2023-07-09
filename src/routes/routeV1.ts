import express from "express";
import passport from "passport";
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
router.post("/user/forgot-password", basicAuth, UserController.requestPasswordReset);
router.post("/user/reset-password/:token", basicAuth, UserController.resetPassword);
router.get("/google", passport.authenticate("google", {scope: ["email", "profile"]}));
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    res.redirect("/api/v1/auth/profile");
});


export default router;
