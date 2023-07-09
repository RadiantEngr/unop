import { Request, Response } from "express";
import _ from "lodash";
import moment from "moment";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User";
import UserOtp from "../models/UserOtp";
import Utils from "./Utils";
import sendResponse from "./ResponseService";
import emailService from "./EmailService"
import config from "../config";
import MailTemplates from "../enums/MandrillTemplates";
import VerificationType from "../enums/VerificationType";
import LoginType from "../enums/LoginType";
import PasswordResetToken from "../models/PasswordResetToken";
import EmailSender from "../enums/EmailSender";


export default {
    signup: async (req: Request)  => {
        const { email, username} = req.body;
        const user = await User.findOne({$or: [{ email }, { username }]});
        if (user) {
            return {
                success: false,
                message: "User already exists"
            }
        }

        req.body.email = _.trim(email.toLowerCase());
        req.body.username = !username ? email : username;
        const savedUser = await User.create(req.body);
        console.info(`User cretaed: ${email}`);

        return {
            success: true,
            message: "User registration successful",
            savedUser
        };
    },

    getAllUsers: async () => {
        try {
          const users = await User.find({});          
          return users;
        } catch (err) {
            console.log(`Error while fetching users: ${err}`);
            throw new Error(`An error occured while processing this request: ${err}`);
        }
    },

    getUserById: async (userId: string) => {
        try {
          const user = await User.findById(userId);
          return user;
        } catch (err) {
            console.log(`Error while fetching user: ${err}`);
            throw new Error(`An error occured while processing this request: ${err}`);
        }
    },

    updateUser: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);      
            if (!user) {
                return sendResponse(req, res, 404, "User not found");
            }
      
            await User.findByIdAndUpdate(userId, req.body, {new:true});
        } catch (err) {
            console.log(`Error while updating user: ${err}`);
            throw new Error(`Error while updating user: ${err}`);
        }
    },

    requestVerificationOtp: async (email: string) => {        
        const user = await User.findOne({email});
        if (!user) {
            return {success: false, message: "User does not exist"}
        }               
        // const otp = Utils.getRandomNumber(config.otpLength);
        const otp = "123456";
        
        const userOtp = new UserOtp({
            user: user?._id,
            otp,
            expiryTime: moment().add(config.otpValidityInMinutes, "minutes").toDate(),
            sentTo: email
        });        

        const splitOtp = Utils.splitNumberIntoDigits(Number(otp));
        const filledOtp = Utils.fillArrayWithZeros(splitOtp);
        
        const globalMergeVars = [
            {
                name: "A",
                content: filledOtp[0]
            },
            {
                name: "B",
                content: filledOtp[1]
            },
            {
                name: "C",
                content: filledOtp[2]
            },
            {
                name: "D",
                content: filledOtp[3]
            },
            {
                name: "E",
                content: filledOtp[4]
            },
            {
                name: "F",
                content: filledOtp[5]
            }
        ]
      
        try {
          await Promise.all([userOtp.save(), emailService.sendTemplateEmail(MailTemplates.OTP, "VERIFICATION OTP", EmailSender.NO_REPLY, [{ email }], globalMergeVars)]);
          return {success: true, message: "OTP sent to your email address"}
        } catch (err) {
          console.warn(`${email} -> OTP persistence error: ${err}`);
          return {success: false, message: "Could not send OTP"};
        }
    },

    verifyUser: async (req: Request) => {
        const { verificationType } = req.body;
        if (!verificationType) {
            return {
                success: false,
                message: "Verification type not specified"
            }
        }

        if (verificationType.toLowerCase() === VerificationType.OTP) {
            const otpValidityCheck =  await verifyOtp(req);            
            if (!otpValidityCheck.success) {
                return otpValidityCheck;
            }

            await User.findOneAndUpdate({email: req.params.email}, {isVerified: true}, {new: true});

            return {
                success: true,
                message: "User verification successful"
            }
        }
    },

    userLogin: async (req: Request) => {
        const { loginType } = req.query;
        if (!loginType) {
            return {
                success: false,
                message: "Login type not specified"
            }
        }

        if (loginType.toString().toLocaleLowerCase() === LoginType.PASSWORD) {
            const { username, password } = req.body;
            if (!username || !password) {
                return {
                    success: false,
                    message: "'Username' and 'Password' are required fields"
                }
            }

            const user = await User.findOne({$or: [{ username }, { email: username }]});

            if (!user) {
                return {
                    success: false,
                    message: "Invalid username or password"
                }
            }

            const hashedPassword = user.password;
            const isMatch = await bcrypt.compare(password, hashedPassword);
            
            if (!isMatch) {
                return {
                    success: false,
                    message: "Invalid username or password"
                }
            }

            const loggedInUser = await User.findOneAndUpdate({email: user.email},
                {isLoggedIn: true, lastLoggedIn: new Date()},
                {new: true});
            
            return {
                success: true,
                message: "User login successful",
                loggedInUser
            }
        }
    },

    requestPasswordReset: async (req: Request) => {
        const { email, username } = req.body;
        if (!email && !username) {
            return {
                success: false,
                message: "Client's 'username' or 'email' must be provided"
            }
        }

        const user = await User.findOne({$or: [{ email }, { username }]});        
        if (!user) {
            return {
                success: false,
                message: "User does not exist"
            }
        }

        const token = crypto.randomBytes(config.tokenLength).toString('hex');
        const resetToken = new PasswordResetToken({
            user: user._id,
            token,
            expiryTime: moment().add(config.otpValidityInMinutes, "minutes").toDate(),
            sentTo: user.email
        });

        const globalMergeVars = [
            {
                name: "user",
                content: user.fullName? user.fullName.split(" ")[0] : user.username ? user.username : user.email
            }
        ]
      
        try {
            await Promise.all([resetToken.save(), emailService.sendTemplateEmail(MailTemplates.RESET_PASSWORD, "RESET PASSWORD", EmailSender.NO_REPLY, [{ email: user.email }], globalMergeVars)]);
            return {
                success: true,
                message: "Password reset email sent",
                token
            }
        } catch (err) {
          console.warn(`${email} -> Paaword reset token persistence error: ${err}`);
          return {success: false, message: "Could not send password reset token"};
        }
    },

    resetPassword: async (req: Request) => {
        const { token } = req.params;
        const { newPassword, confirmNewPassword } = req.body;
        if (!newPassword || !confirmNewPassword) {
            return {
                success: false,
                message: "'newPassword' and 'confirmNewPassword' are required fields"
            }
        }

        if (newPassword !== confirmNewPassword) {
            return {
                success: false,
                message: "The password values provided are not consistent"
            }
        }

        const expectedToken = await PasswordResetToken.findOne({
            token,
            expiryTime: {$gte: new Date()}
        });

        if (!expectedToken) {
            return {
                success: false,
                message: "Invalid or expired token"
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, config.saltRounds)
        await User.findByIdAndUpdate(expectedToken.user, {password: hashedPassword}, {new: true});
    
        return {
            success: true,
            message: "Password reset successful"
        };
    }    
};

const verifyOtp = async (req: Request) => {
    const { email } = req.params;
    const { otp } = req.body;
    if (!otp) {
        return {
            success: false,
            message: "OTP not specified"
        }
    }

    const expectedOtp = await UserOtp.findOne({
        sentTo: email,
        expiryTime: {$gte: new Date()}
    }).sort({createdAt: -1}).limit(1);

    if (!expectedOtp) {
        return {
            success: false,
            message: "User has not requested an OTP recently"
        }
    }

    if (otp !== expectedOtp.otp) {
        return {
            success: false,
            message: "Invalid OTP"
        }
    };

    return {
        success: true,
        message: "OTP verification successful"
    };
}
