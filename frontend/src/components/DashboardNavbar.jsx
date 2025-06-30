import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "../helper";
import useUserStore from "../store/user";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import eduHubLogo from "../public/assets/EduHubLogo.webp";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const onButtonClick = () => {
    removeToken();
    setUser(null);
    navigate("/");
  };

  return (
    <div className="border-b bg-white shadow-md ">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mx-5 sm:mx-0">
          {/* Left Section - Logo and Hamburger */}
          <div className="flex items-center">
            {/* Hamburger Menu (only visible on mobile) */}
            {/* {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 mr-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? (
                  <FiX className="text-2xl" />
                ) : (
                  <FiMenu className="text-2xl" />
                )}
              </button>
            )} */}
            
            {/* Logo */}
            <NavLink to="/" className="inline-flex items-center">
              <img
                className="h-[50px] lg:h-[100px] w-[50px] lg:w-[100px]"
                src={eduHubLogo}
                alt="Mentorship Hub"
              />
              <span className="text-xl lg:text-4xl font-bold text-teal-700">EduHub</span>
            </NavLink>
          </div>

          {/* Right Section - Logout Button */}
          <div>
            <button
              onClick={onButtonClick}
              className="flex items-center px-2 lg:px-6 py-2 lg:py-3 text-white transition-colors duration-300 transform bg-red-400 border rounded-full lg:rounded-lg hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
            >
              <span className="mx-2 font-medium hidden lg:block">Log Out</span>
              <FiLogOut className="text-xl text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;