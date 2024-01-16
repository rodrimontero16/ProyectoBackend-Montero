import "dotenv/config.js"

export default {
    port: process.env.PORT || 8080,
    env: process.env.ENV,
    presistence: process.env.PERSISTENCE,
    db: {
        mongodbUri: process.env.MONGODB_URI
    },
    secret: {
        jwtSecret: process.env.JWT_SECRET,
        cookieSecret: process.env.COOKIE_SECRET
    },    
    github: {
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET
    },
    gmail: {
        userGmail: process.env.GMAIL_USER,
        passGmail: process.env.GMAIL_PASSWORD
    },
    twilio: {
        accountSID: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
    }
}