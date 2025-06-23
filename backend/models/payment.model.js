const mongoose= require("mongoose")
const { Schema, model } = require("mongoose");
const paymentSchema= new Schema({

    booking: {
        type: Schema.Types.ObjectId,
        ref: "Booking"
    },

    transactionId: {
        type: String
    },  

},{ timestamps: true })


const PaymentModel = model("Payment", paymentSchema);

module.exports= PaymentModel