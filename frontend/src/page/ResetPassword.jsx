// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import auth from '../apiManager/auth';
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Nav from '../components/Nav';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [isLoading, setIsLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(300);

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerifyOtp = async (data) => {
    setIsLoading(true);
    try {
      await auth.verifyOtp({ email, otp: data.otp, token });
      toast.success("OTP verified successfully");
      setOtpVerified(true);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
        console.log("handleResendOtp: ",token);
        
      await auth.sendOtp({email, token});
      toast.success("OTP resent to your email");
      setTimer(300);
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitNewPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await auth.resetPassword({ email, newPassword: data.newPassword, token });
      toast.success("Password changed successfully");
      navigate("/signin");
    } catch (error) {
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen py-10 bg-teal-100 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-teal-700 mb-4">
            {otpVerified ? "Set New Password" : "Verify OTP"}
          </h2>

          {!otpVerified ? (
            <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
                {...register("otp", {
                  required: "OTP is required",
                  minLength: {
                    value: 4,
                    message: "OTP must be at least 4 characters"
                  }
                })}
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}

              {timer > 0 ? (
                <>
                 <p className="text-sm text-gray-600">OTP expires in {formatTime(timer)}</p>
                
                </>
               
              ) : (
                <button type="button" onClick={handleResendOtp} disabled={isLoading} className="text-sm text-teal-600 hover:underline">
                  Resend OTP
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg"
              >
                {isLoading ? <Spin indicator={<LoadingOutlined spin style={{fontSize: 26}}/>}  style={{color: "white" }} /> : "Verify OTP"}
              </button>
              <p className="text-sm text-gray-600 text-red-500 text-center">* Please don't refresh this page</p>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmitNewPassword)} className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters"
                  }
                })}
              />
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
                {...register("confirmPassword", {
                  required: "Please confirm your password"
                })}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg"
              >
                {isLoading ? <Spin indicator={<LoadingOutlined spin style={{fontSize: 26}}/>}  style={{color: "white" }} /> : "Change Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
