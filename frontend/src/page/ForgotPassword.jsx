// src/pages/ForgotPassword.jsx
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import auth from '../apiManager/auth';
import toast from 'react-hot-toast';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import { useState } from 'react';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (data) => {
    try {
        setIsLoading(true)
      const res = await auth.sendOtp({ email: data.email });
      console.log(res);
      
      toast.success("OTP sent to your email");
    
      // Redirect to reset-password page with token in URL
      navigate(`/reset-password?token=${res.data.token}&email=${data.email}`);
    } catch (error) {
       
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }finally{
        setIsLoading(false)
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen py-10 bg-teal-100 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-teal-700 mb-4">Forgot Password</h2>
          <form onSubmit={handleSubmit(handleSendOtp)} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Email is not valid",
                },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg"
            >
            {isLoading? <Spin indicator={<LoadingOutlined spin style={{fontSize: 26}}/>}  style={{color: "white" }} />: "Send OTP"}  
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
