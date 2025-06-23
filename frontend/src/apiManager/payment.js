import axios from "axios";
import AxiosInstances from "./index.js";
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/v1';

const createOrder = async ({ amount, currency, name, description,mentorName, mentorEmail, bookingId }) => {
    try { 
      console.log("Api manager: ", bookingId);
      
        console.log(API_URL);
        
      const response = await AxiosInstances.post(`${API_URL}/payment/create-order`, {
        amount,
        currency,
        name,
        description,
        mentorName,
        mentorEmail,
        bookingId
      });
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  };

const verifyPayment = async (paymentData, bookingId) => {
    try {
      console.log("apiManager:",bookingId);
      
      const response = await AxiosInstances.post(`${API_URL}/payment/verify-payment/${bookingId}`, paymentData);
      return response.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      return null;
    }
  };

  const getMentorPayments= async()=>{
try{
  const response = await AxiosInstances.get(`${API_URL}/payment/mentor`)
  return response.data;
}catch(error){
  console.error("error in fetching payments: ", error);
  return null;
}
  }

  const paymentApi = {
    createOrder,
    verifyPayment,
    getMentorPayments
  }


export default paymentApi;
