require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    DB_URL : process.env.DB_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
    PREFIX: process.env.PREFIX || '/v1',
    zoom:{
    clientId: process.env.ZOOM_CLIENT_ID,
    clientSecret: process.env.ZOOM_CLIENT_SECRET,
    accountId: process.env.ZOOM_ACCOUNT_ID
    },
   
    email: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
        from: process.env.EMAIL_FROM,
      },
    jwt:{
        accessSecret:process.env.JWT_ACCESS_SECRET || "random-secret",
        accessExpirationMinutes:process.env.JWT_ACCESS_EXPIRATION_MINUTES || 300,
        verificationSecret:process.env.JWT_VERIFICATION_SECRET || "random-secret",
        verificationExpirationMinutes:process.env.JWT_VERIFICATION_EXPIRATION_MINUTES || 5,
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    razorpay:{
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret : process.env.RAZORPAY_KEY_SECRET
    }
}