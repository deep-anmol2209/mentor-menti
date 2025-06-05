import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useUserStore from "../store/user";
import { Dropdown, Button } from "antd";
import { removeToken } from "../helper";
import eduHubLogo from "../assets/EduHubLogo.webp";

function Nav() {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // use to store scroll position

  const signupMentorBtnClick = () => navigate("/signup/mentor");
  const signupStudentBtnClick = () => navigate("/signup/student");
  const signInBtnClick = () => navigate("/signin");

  const onLogoutBtnClick = () => {
    removeToken();
    setUser(null);
    navigate("/");
  };

  // Items list for dropdown menu in navbar
  const items = [
    {
      key: "1",
      label: (
        
          <NavLink to='/dashboard/profile'>
          <p className='py-2 bg-teal-600 rounded-md text-white px-5 text-2xl font-medium'>Dashboard</p>
        </NavLink>
       
      ),
    },
    {
      key: "2",
      label: (
        <button
          onClick={onLogoutBtnClick}
          className='px-3 bg-red-500 rounded-xl w-full py-2 text-white hover:bg-red-600'
        >
          <span className='text-lg'>Logout</span>
        </button>
      ),
    },
  ];

  // handleScroll logic to set isScrolled based on scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={`h-[100px] sticky top-0 z-50 transition-all duration-500 ${isScrolled ? "bg-teal-50" : "bg-white"}`}>
        <div className='px-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20'>
          <div className='realtive flex items-center justify-between'>
            <div className='flex items-center'>
              <NavLink
                to='/'
                className='inline-flex items-center mr-8'
              >
                <img
                  className='h-[80px] sm:h-[100px] w-[80px] sm:w-[100px]'
                  src={eduHubLogo}
                  alt='Mentorship Hub'
                />
                <span className='text-4xl font-bold text-teal-700'>EduHub</span>
              </NavLink>
            </div>

            {/* Mobile Menu Button */}
            {!user && (
              <div className='lg:hidden flex items-center'>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className='text-gray-600 focus:outline-none'
                >
                  <span className='text-3xl'>&#9776;</span>
                </button>
              </div>
            )}

            {/* Desktop Navigation Menu when user is not logged in */}
            {!user ? (
              <ul className='items-center hidden space-x-2 lg:flex'>

                <li>
                  <button
                    className='font-medium tracking-wide text-teal-500 hover:text-teal-700 transition-all duration-500 px-6 h-12 rounded hover:border hover:border-teal-700'
                    onClick={signInBtnClick}
                  >
                    Sign In
                  </button>
                </li>

                <li>
                  <button
                    className='inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-all duration-300'
                    onClick={signupStudentBtnClick}
                  >
                    Enroll Now
                  </button>
                </li>
              </ul>
            ) : (
              <Dropdown
                menu={{ items }}
                trigger={"hover"}
                arrow
                size="large"
                
              >
                <button className='bg-teal-500 px-4 py-3 rounded-full hover:bg-teal-600 text-2xl text-white font-semibold'>{user.name.charAt(0).toUpperCase()}</button>
              </Dropdown>
            )}

            {/* when isMobileMenuOpen is true */}
            {!user && isMobileMenuOpen && (
              <div className='absolute top-[100px] left-0 w-full bg-white shadow-lg p-4 space-y-4 lg:hidden z-10'>
                <div className='py-5 flex flex-col gap-4'>
                  {/* Mentor Section */}
                  {/* <button
                    className='block w-full text-center py-2 font-medium tracking-wide text-gray-800 border-4 border-teal-500 bg-teal-500 rounded-md hover:bg-teal-600 transition-all duration-300 hover:text-white'
                    onClick={signupMentorBtnClick}
                  >
                    Become a Mentor with Us
                  </button> */}

                  {/* Signin */}
                  {/* <button
                    className='block w-full text-center py-2 font-medium tracking-wide text-teal-500 hover:text-teal-700 transition-all duration-300'
                    onClick={signInBtnClick}
                  >
                    Sign In
                  </button> */}
                  
                  <button
                    className='font-medium tracking-wide text-teal-500 hover:text-teal-700 transition-all duration-300 px-6 h-12 rounded hover:border hover:border-teal-700'
                    onClick={signInBtnClick}
                  >
                    Sign In
                  </button>
                

                  {/* SignUp */}
                  <button
                    className='block w-full text-center py-2 font-medium tracking-wide text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-all duration-300'
                    onClick={signupStudentBtnClick}
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;
