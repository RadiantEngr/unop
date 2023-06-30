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
    
    saltRounds : 10,
    otpLength: 6,
    otpValidityInMinutes: 5
}
