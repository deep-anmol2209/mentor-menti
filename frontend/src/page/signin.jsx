import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import useUserStore from '../store/user';
import { useForm } from 'react-hook-form';
import auth from "../apiManager/auth";
import { setToken } from '../helper';
import toast from 'react-hot-toast';
import Nav from '../components/Nav';


const Signin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useUserStore();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();


  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await auth.signin(data);
      reset();
      setUser(response.data.user);
      setToken(response.data.token);
      navigate("/");
      toast.success("Login Successfully!")
    } catch (error) {
      console.log("Singin Error :", error);
      toast.error("Login failed! Invalid credentials")
    }
    setIsLoading(false);

  }
  return (
    <>
      <Nav />

      <div className="sm:h-screen min-h-screen py-10 bg-teal-100">
        <div className="flex items-center justify-center h-full">
          {/* Form Container */}
          <div className="w-full max-w-lg px-6 py-8 bg-white bg-opacity-90 rounded-lg shadow-xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-teal-800">Welcome Back</h1>
              <p className="mt-2 text-gray-600">
                Sign In to access your account
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 space-y-4 text-gray-800"
            >

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className={`block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-gray-100 border ${errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring focus:ring-teal-300 focus:outline-none`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className={`block w-full px-4 py-2 mt-2 placeholder-gray-500 bg-gray-100 border ${errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring focus:ring-teal-300 focus:outline-none`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  disabled={isLoading}
                  className="w-full px-4 py-2 font-semibold text-white transition duration-300 bg-teal-500 rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring focus:ring-teal-300 disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Sign In"}
                </button>
                <Link
                to="/forgot-password"
                className="mt-4 block text-sm text-center cursor-pointer hover:underline text-teal-600"
              >
                Forgot password?
              </Link>
              </div>

              
            </form>

            {/* Studnet signup link */}
            <p className="mt-6 text-sm text-center text-gray-600">
              Don't have an account yet?{" "}
              <NavLink
                to="/signup/student"
                className="font-medium text-teal-600 hover:underline"
              >
                Sign Up
              </NavLink>
              .
            </p>


          </div>
        </div>
      </div>

    </>
  )
}

export default Signin;