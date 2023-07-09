import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import HealthChecker from "./routes";
import Router from "./routes/routeV1";
import { connectToDatabase } from "./db/ConnectionFactory";
import session from 'express-session';
import googleAuth from "./middlewares/GoogleAuth";
import config from "./config";


const app = express();
dotenv.config();
const { PORT = 4000 } = process.env;

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use(session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
    })
);
  
// Configure Passport
app.use(passport.initialize());
app.use(passport.session());

googleAuth();

passport.serializeUser( (user, done) => {
  done(null, user);
});

passport.deserializeUser( (user: any, done) => {
  done(null, user);
});
  

app.use("/", HealthChecker);
app.use("/api", Router);

connectToDatabase();

app.listen(PORT, () => {
    console.log(`Server started: listening on port ${PORT}`)
});
