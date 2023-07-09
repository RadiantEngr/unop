export default {
    db: {
        url: process.env.DATABASE_URL || "mongodb://localhost:27017/unox-api",
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    basicAuth: {
        user: process.env.AUTH_USER || "apiunoxadmin",
        password: process.env.AUTH_PASS || "xP%h379U6Pjz#@&&2RA%"
    },

    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "914768259946-fv958gos7nbtn7k080er6r4mmcstaj17.apps.googleusercontent.com",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
        callbackUrl: process.env.UNOX_API_URL ? `${process.env.UNOX_API_URL}/api/google/redirect` : "http://localhost:4000/api/google/redirect"
    },
    
    sessionSecret: process.env.SESSION_SECRET || "unox_api_session_secret",
    saltRounds : 10,
    otpLength: 6,
    tokenLength: 32,
    passLegth: 16,
    otpValidityInMinutes: 5,
    passwordGenerationCharacters: process.env.PASSWORD_GENERATION_CHARACTERS || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
}
