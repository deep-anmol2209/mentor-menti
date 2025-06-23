import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import paymentApi from "../../apiManager/payment";
import bookingApi from "../../apiManager/booking";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, serviceId } = useParams();
  
  const { 
    service,
    slotDetails,
    mentor
  } = location.state || {}; 
console.log(location.state);
console.log(mentor);
// const {fromDate, startTime, courseType, duration, price, endTime }= service
const {date, startTime, endTime= "", duration, price, bookingId}= slotDetails



  const [mobileNumber, setMobileNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  

  const handlePaymentProcess = async () => {
    console.log(mentor.name);
    
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
  
    setIsProcessing(true);
  
    try {
      // Create order from backend
      const order = await paymentApi.createOrder({
        amount: price,
        currency: "INR",
        name: "EduHub Booking",
        description: `Booking for ${new Date(date).toLocaleDateString()}`,
        bookingId,
        mentorName: mentor.name,
        mentorEmail: mentor.email
      });
  
      const options = {
        key: order.key_id, // Use backend-provided key_id
        amount: order.amount,
        currency: "INR",
        order_id: order.order_id, // Use order_id returned from backend
        name: order.name,
        description: order.description,
        prefill: {
          name: order.name,
          email: order.email,
          contact: mobileNumber || order.contact,
        },
        handler: async (response) => {
          try {
            console.log("bookingId: ", bookingId);
            
            // Send response to backend for signature verification
            await paymentApi.verifyPayment(response, bookingId);
  
            navigate("/dashboard/booking", {
              state: {
                bookingDetails: { date, startTime, endTime, price },
                paymentId: response.razorpay_payment_id
              }
            });
          } catch (error) {
            console.error("Post-payment processing failed:", error);
            alert("Payment verification or booking creation failed");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment failed to initiate");
    } finally {
      setIsProcessing(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Confirm Your Payment</h2>
        
       

        {
              service.courseType=== "one-on-one"? (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg shadow-inner">
                <p className="text-gray-700 font-medium mb-2">

            
                Date: {new Date(date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
              <p className="text-gray-700 font-medium mb-2">
                Time Slot: {startTime} - {endTime}
              </p>
              <p className="text-gray-700 font-medium text-lg">
                Total Price: ₹{price}
              </p>
              </div>
              ) :(
                <div className="mt-4 p-4 bg-blue-50 rounded-lg shadow-inner">
                 <p className="text-gray-700 font-medium mb-2">

            
                Date: {new Date(date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
              <p className="text-gray-700 font-medium mb-2">
                Start time: {startTime} 
              </p>
              <p className="text-gray-700 font-medium text-lg">
                Total Price: ₹{price}
              </p>
              </div>)
            
            }
         
        

        <div className="mt-4">
          <label className="block text-gray-600 font-medium mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            maxLength={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            placeholder="Enter 10-digit mobile number"
          />
        </div>

        <button
          onClick={handlePaymentProcess}
          disabled={isProcessing}
          className={`w-full mt-6 py-2 px-4 rounded-lg font-bold text-white ${
            isProcessing ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          } transition duration-300`}
        >
          {isProcessing ? "Processing..." : `Proceed to Pay ₹${price}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;