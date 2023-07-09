import dotenv from "dotenv";
dotenv.config();

export default {
    db: {
        url: process.env.DATABASE_URL || "mongodb://localhost:27017/unox-api",
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    basicAuth: {
        user: process.env.AUTH_USER,
        password: process.env.AUTH_PASS 
    },

    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackUrl: `${process.env.UNOX_API_URL}/api/google/redirect`
    },
    
    sessionSecret: process.env.SESSION_SECRET || "",
    saltRounds : 10,
    otpLength: 6,
    tokenLength: 32,
    passLegth: 16,
    otpValidityInMinutes: 5,
    passwordGenerationCharacters: process.env.PASSWORD_GENERATION_CHARACTERS || ""
}
