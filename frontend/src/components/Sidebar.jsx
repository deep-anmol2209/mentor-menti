import React from "react";
import { NavLink } from "react-router-dom";
import useUserStore from "../store/user";
import { FiX, FiMenu } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendarDays,
  faUserGear,
  faIndianRupeeSign,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ toggleSidebar, isSidebarOpen, isMobile, onClose }) => {
  const { user } = useUserStore();
console.log(isMobile);

  const navItems = [
    {
      label: "Profile",
      path: "/dashboard/profile",
      icon: <FontAwesomeIcon icon={faUser} />,
    },
    {
      label: "Bookings",
      path: "/dashboard/bookings",
      icon: <FontAwesomeIcon icon={faCalendarDays} />,
    },
    ...(user?.role === "mentor"
      ? [
          {
            label: "Services",
            path: "/dashboard/services",
            icon: <FontAwesomeIcon icon={faUserGear} />,
          },
          {
            label: "Payment",
            path: "/dashboard/payment",
            icon: <FontAwesomeIcon icon={faIndianRupeeSign} />,
          },
        ]
      : []),
  ];

  return (
    <aside
      className={`flex flex-col w-64 min-h-[calc(100vh-52px)] ${
        isSidebarOpen ? "px-4" : "px-2"
      } py-8 bg-white/80 backdrop-blur-xl shadow-xl border-r border-gray-200 `}
    >
      <div className="flex-1">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden absolute top-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <FiX size={20} />
            ) : (
              <FiMenu className="text-2xl " />
            )}
          </button>
        )}

        {/* <button 
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
      >
        <FiX size={20} />
      </button> */}
        {/* User Info */}
        {isSidebarOpen && (
          <>
            <div className="flex flex-col items-center text-center">
              {/* <img
          className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-white"
          src={user.photoUrl || `https://ui-avatars.com/api?name=${user?.name}`}
          alt={`${user?.name}'s avatar`}
        /> */}
              <h2 className="mt-4 text-lg font-bold text-gray-800">
                {user?.name}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            {/* Divider */}
            <div className="my-6 border-t border-gray-200" />
          </>
        )}

        {/* Navigation */}
        <nav
          className={`flex flex-col gap-5 ${
            !isSidebarOpen ? "mt-16 w-[45px]" : "mt-0"
          }`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-start px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-sm"
                    : "text-gray-700 hover:bg-teal-100 hover:text-gray-900"
                }`
              }
            >
              <div className="w-6 h-6 flex justify-center items-center">
                {item.icon}{" "}
              </div>
              &nbsp; {isSidebarOpen && item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <nav
          className={`flex flex-col gap-5 ${
            !isSidebarOpen ? "mt-16 w-[45px]" : "mt-0"
          }`}
        >
      <NavLink
        to="/dashboard/settings"
        className={({ isActive }) =>
          `flex items-center justify-start px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-sm"
              : "text-gray-700 hover:bg-teal-100 hover:text-gray-900"
          }`
        }
      >
        <div className="w-6 h-6 flex justify-center items-center">
          <FontAwesomeIcon icon={faGear} />{" "}
        </div>
        &nbsp; {isSidebarOpen && "Setting"}
      </NavLink></nav>
      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Mentor Panel</p>
      </div>
    </aside>
  );
};

export default Sidebar;
