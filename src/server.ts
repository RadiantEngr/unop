import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import HealthChecker from "./routes";
import Router from "./routes/routeV1";
import { connectToDatabase } from "./db/ConnectionFactory";


const app = express();
dotenv.config();
const { PORT = 4000 } = process.env;

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/", HealthChecker);
app.use("/api", Router);

connectToDatabase();

app.listen(PORT, () => {
    console.log(`Server started: listening on port ${PORT}`)
});
