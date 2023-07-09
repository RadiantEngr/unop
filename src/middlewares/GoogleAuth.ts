import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import config from "../config";
import User from "../models/User";
import Utils from "../services/Utils";
const { google } = config;

const GoogleStrategy = passportGoogle.Strategy;

const googleAuth = () => {
    passport.use(
        new GoogleStrategy(
          {
            clientID: google.clientId,
            clientSecret: google.clientSecret,
            callbackURL: google.callbackUrl
          },

          async (accessToken: string, refreshToken: string, profile: any, done) => {     
            const { email, name, email_verified } = profile._json;
            const user = await User.findOne({ email });

            if (user) {
                const userUpdate = { 
                    fullName: user && user.fullName ? user.fullName : name,
                    isVerified: email_verified,
                    isLoggedIn: true,
                    lastLoggedIn: new Date
                };

                await User.findOneAndUpdate({ email }, userUpdate, { new: true })
            } else {
                const newUser = { 
                  email,
                  username: email,
                  fullName: name,
                  isVerified: email_verified,
                  password: Utils.generatePassword(config.passLegth),
                  isLoggedIn: true,
                  lastLoggedIn: new Date
                };

                await User.create(newUser);
            }

            done(null, profile);
          }
        )
    );
  }

  export default googleAuth;