import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/v1';

const createOrder = async ({ amount, currency, name, description }) => {
    try {
        console.log(API_URL);
        
      const response = await axios.post(`${API_URL}/payment/create-order`, {
        amount,
        currency,
        name,
        description,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  };

const verifyPayment = async (paymentData) => {
    try {
      const response = await axios.post(`${API_URL}/payment/verify-payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      return null;
    }
  };

  const paymentApi = {
    createOrder,
    verifyPayment
  }


export default paymentApi;
