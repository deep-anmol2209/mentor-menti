import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "../helper";
import useUserStore from "../store/user";
import { FiLogOut } from "react-icons/fi";
import eduHubLogo from "../assets/EduHubLogo.webp";



const DashboardNavbar = () => {

  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const onButtonClick = () => {
    removeToken();
    setUser(null);
    navigate("/");
  };

  return (
    <div>
      <div className='border-b bg-white shadow-md'>
        <div className='container mx-auto'>
          <div className='flex items-center justify-between'>
            {/* Logo Section */}
            <div className='flex items-center'>
              <NavLink
                to='/'
                className='inline-flex items-center mr-8'
              >
                <img
                  className='h-[100px] w-[100px]'
                  src={eduHubLogo}
                  alt='Mentorship Hub'
                />
                <span className='text-4xl font-bold text-teal-700'>EduHub</span>
              </NavLink>
            </div>

            {/* Logout Button Section */}
            <div>
              <button
                onClick={onButtonClick}
                className='flex items-center w-full px-6 py-3 text-white transition-colors duration-300 transform bg-red-400 border rounded-lg hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50'
              >
                <span className='mx-2 font-medium'>Log Out</span>
                <FiLogOut className='text-xl text-white' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
