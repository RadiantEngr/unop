import mongoose from "mongoose";
import config from "../config";
// TODO - Rollbar
// const Rollbar = require('../services/Rollbar');

  
export const connectToDatabase = () => {
    const connection = mongoose.connect(config.db.url);

    let hasConnected = false, isOnline = false;

    mongoose.connection.on('error', (err) => {
        console.error('Connection could not be established, error: ', err);
        // TODO - Rollbar.instance().handleError(err);
    });
     
    mongoose.connection.on('connecting', () => {
        console.info(`DB attempting to connect...`);
    });
     
    mongoose.connection.on('reconnected', () => {
        isOnline = true;
        console.warn(`DB connection has been re-established.`);
    });
     
    mongoose.connection.on('disconnected', () => {
        isOnline = false;
        console.error(`DB connection was lost.`);
    });
     
    mongoose.connection.on('open', () => {
        console.info(`DB connection has been established.`);
        isOnline = hasConnected = true;
    });
     
    return connection;
};
