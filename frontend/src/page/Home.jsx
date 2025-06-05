import React from "react";
import Nav from "../components/Nav";
import { NavLink } from "react-router-dom";
import TopMentors from "../components/TopMentors";
import { heroHome, heroMen, shapeOne, shapeTwo, shapeThree, shapeFour, faqImage } from "../assets/HomePage";
import MentoringImage from "../assets/About/about-img-3.png";
import FeatureImage from "../assets/feature-img-1.png";
import mentee1 from "../assets/mentee1.png";
import { FaChalkboardTeacher, FaLink, FaBookReader, FaLightbulb, FaArrowRight } from "react-icons/fa";
import { GiUpgrade } from "react-icons/gi";
import features from "../data/features";
import faqs from "../data/faqs";
import FeaturesCard from "../components/FeaturesCard";
import FaqSet from "../components/FaqSet";

function Home() {
  return (
    <>
      <Nav />
      <div className='bg-white'>

        {/* Hero Section */}
        <section className='relative bg-teal-100 py-16 md:py-20 h-[560px] px-6 md:px-20 mx-auto max-w-screen-full '>
          <img
            className='absolute bottom-0 right-0 h-[520px] opacity-5'
            src={heroHome}
            alt='Mentorship Hub'
          />
          <img
            className='absolute bottom-0 right-0 h-[460px] opacity-90'
            src={shapeFour}
            alt='Graphics 4'
          />
          <img
            className='absolute top-0 left-0 h-[460px] opacity-90 '
            src={shapeOne}
            alt='Graphics 4'
          />
          <img
            className='absolute top-5 left-0 h-[460px] opacity-90'
            src={shapeTwo}
            alt='Graphics 4'
          />
          <img
            className='absolute bottom-10 left-0 h-[160px] opacity-90'
            src={shapeThree}
            alt='Graphics 4'
          />
          <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center'>
            {/* Text Section */}
            <div className='md:w-1/2 text-center md:text-left z-10'>
              {/* learn with mentor button */}
              <div className='bg-white px-2 py-2 w-[260px] rounded-full flex justify-center items-center gap-3 text-sm m-auto md:mx-0 mb-8'>
                <div className='bg-teal-100 px-2 py-2 rounded-full'>
                  <FaChalkboardTeacher className='text-teal-900' />
                </div>
                <div className='text-teal-800'>Learn with best Mentorship</div>
              </div>

              <h1 className='text-md font-extrabold text-teal-800 leading-tight'>
                <span className='text-7xl text-teal-900'>EduHub</span>
                <br />
                <span className='text-2xl md:text-3xl lg:text-4xl text-teal-700'>Get The Best Mentorship From Us</span>
              </h1>
              <p className='mt-6 text-lg md:text-xl lg:text-2xl text-teal-700'>
                Every great achiever was inspired by a great mentor. Find yours today!
              </p>
              <div className='mt-8'>
                <NavLink to='/mentors'>
                  <button className='px-8 py-3 text-white text-lg font-medium bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 hover:scale-105 transition-all duration-700'>
                    Match with a Mentor
                  </button>
                </NavLink>
              </div>
            </div>

            {/* Image Section */}
            <div className='md:w-1/2  hidden md:flex justify-center'>
              <div className='relative h-[460px] flex items-end'>
                <img
                  className='max-w-lg rounded-lg z-[3]'
                  src={heroMen}
                  alt='EduHub Mentor Image'
                />
                {/* Decorative Elements */}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='relative px-6 md:px-20 py-16 md:py-24 bg-teal-700 '>
          <div className='max-w-6xl mx-auto flex flex-col gap-12'>
            
            {/* features button */}
            <div className='flex flex-col gap-2 justify-center items-center mt-10'>
              <div className='bg-white px-2 py-2 w-[130px] rounded-full flex justify-center items-center gap-2 text-sm m-auto md:mx-0 mb-8'>
                <div className='bg-teal-100 px-2 py-2 rounded-full'>
                  <FaChalkboardTeacher className='text-teal-900' />
                </div>
                <div className='text-teal-800'>Features</div>
              </div>
              <span className='text-5xl text-white font-semibold text-center'>What You Looking For?</span>
              <span className='text-3xl text-white text-center'>Discover the perfect match for your learning journey.</span>
            </div>

            {/* Features Card */}
            <div className='grid gap-8 row-gap-10 md:grid-cols-2 lg:grid-cols-3'>
              {features.map((feature, index) => (
                <FeaturesCard
                  key={index}
                  feature={feature}
                />
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className='bg-gradient-to-br from-teal-800 via-teal-950 to-teal-700 py-8 px-6 md:px-20'>
          <div className='max-w-screen-xl mx-auto py-16 flex flex-row gap-3'>
            <div className='max-w-6xl  mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-0'>
              {/* Image Section */}
              <div className='w-full lg:w-1/2 flex justify-center'>
                <div className='relative w-full flex items-center md:items-end'>
                  <img
                    className=' w-[500px] lg:w-full mx-auto rounded-lg'
                    src={MentoringImage}
                    alt='EduHub Mentor Image'
                  />
                </div>
              </div>

              {/* Text Section */}
              <div className='w-full lg:w-1/2 text-center lg:text-left px-6 lg:px-10'>
                {/* learn with mentor button */}
                <div className='mt-10'>
                  <div className='bg-white px-2 py-2 w-[200px] rounded-full flex justify-center items-center gap-2 text-sm m-auto lg:mx-0 mb-8'>
                    <div className='bg-teal-100 px-2 py-2 rounded-full'>
                      <FaChalkboardTeacher className='text-teal-900' />
                    </div>
                    <div className='text-teal-800'>About Our Platfrom</div>
                  </div>
                </div>

                <h1 className='text-md font-extrabold text-teal-800 leading-tight'>
                  <span className='text-2xl md:text-3xl lg:text-4xl text-teal-50'>Your Path to Success Starts Here</span>
                </h1>
                <p className='mt-6 text-md md:text-md lg:text-lg text-teal-50'>
                  Whether you're looking to sharpen your skills, advance your career, or simply find guidance, our platform bridges the gap between
                  learners and mentors. With personalized mentorship, flexible sessions, and global access, we help you succeed on your terms.
                </p>
                <div className='mt-8'>
                  <NavLink to='/mentors'>
                    <button className='px-8 py-3 text-white text-lg font-medium bg-teal-600 rounded-full shadow-lg hover:bg-teal-700 hover:scale-105 transition-all duration-500'>
                      Learn More About Us
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Register Now Section */}
        <section className='py-6 lg:my-8'>
          <div className='container mx-auto text-center max-w-screen-xl p-2 md:p-16'>

            {/* Heading section */}
            <div className='mb-12'>
              <h2 className='text-4xl font-extrabold text-teal-900'>What You Looking For?</h2>
              <p className='mt-4 text-lg text-gray-700 md:w-3/4 mx-auto'>
                Join EduHub today and connect with mentors who can guide you towards your goals. Follow our easy steps to start achieving more with
                personalized mentorship.
              </p>
            </div>

            {/* Body Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-12'>

              {/* left section */}
              <div className='border border-gray-200 bg-slate-100 p-4 rounded-xl'>
                <div className='bg-white rounded-lg h-full flex flex-col gap-3 justify-end p-8'>
                  {/* Top section */}
                  <div className='border-b-slate-800 w-full'>
                    <img
                      src={FeatureImage}
                      alt='Fetures image'
                      className='mx-auto'
                    />
                  </div>

                  {/* bottom section */}
                  <div className='border-b-slate-800 w-full border-t-black'>
                    <h3 className='text-2xl font-semibold text-teal-900 leading-6'>Do You Want To Learn Here?</h3>
                    <p className='text-md lg:text-lg lg:w-3/4 mx-auto my-3 leading-5'>
                      Explore all of our courses and pick your suitable ones to enroll and start learning with us!
                    </p>
                    <div className='flex justify-center'>
                      <NavLink to='/signup/student'>
                        <button className='px-5 lg:px-8 py-3 text-white lg:text-lg font-medium bg-teal-600 rounded-full shadow-lg hover:bg-teal-700 hover:scale-105 transition-all duration-500 mt-5 flex justify-center items-center gap-2 lg:gap-5'>
                          <span>Register Now</span> <FaArrowRight />
                        </button>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className='border border-gray-200 bg-slate-100 p-4 rounded-xl'>
                <div className='bg-white rounded-lg h-full flex flex-col gap-3 justify-end p-8'>
                  {/* Top section */}
                  <div className='border-b-slate-800 w-full'>
                    <img
                      src={FeatureImage}
                      alt='Fetures image'
                      className='mx-auto'
                    />
                  </div>

                  {/* bottom section */}
                  <div className='border-b-slate-800 w-full border-t-black'>
                    <h3 className='text-2xl font-semibold text-teal-900'>Do You Want To Teach Here?</h3>
                    <p className='text-md lg:text-lg lg:w-3/4 mx-auto my-3 leading-5'>
                      Explore all of our courses and pick your suitable ones to enroll and start learning with us!
                    </p>
                    <div className='flex justify-center'>
                      <NavLink to='/signup/mentor'>
                        <button className='px-5 lg:px-8 py-3 text-white lg:text-lg font-medium bg-teal-600 rounded-full shadow-lg hover:bg-teal-700 hover:scale-105 transition-all duration-500 mt-5 flex justify-center items-center gap-2 lg:gap-5'>
                          <span>Register Now</span> <FaArrowRight />
                        </button>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Mentor Categories Section */}
        <section className='px-8 py-20 bg-gradient-to-br from-teal-800 via-teal-950 to-teal-700 '>
          <div className='container mx-auto text-center max-w-screen-xl p-2 md:p-16'>
          <h2 className='text-4xl font-extrabold text-white pb-10 text-center'>Find the Right <span className="text-teal-300">Mentor</span> for You</h2>
            <div className='flex flex-col items-center text-center md:flex-row md:text-left md:items-start'>
              {/* Left Section - Heading & Description */}
              <div className='mb-8 md:w-1/3 lg:mr-12'>
                
                <p className='text-lg text-teal-50'>
                  Unlock growth opportunities with expert mentors. Whether you're aiming to boost your career, enhance your skills, or explore new
                  fields, Elevate Hub has the perfect mentor for you.
                </p>

                <div className='flex'>
                  <NavLink to='/mentors'>
                    <button className='px-3 md:px-8 py-3 text-white text-lg font-medium bg-teal-600 rounded shadow-lg hover:bg-teal-700 hover:scale-105 transition-all duration-500 mt-5 flex justify-center items-center gap-2 md:gap-5'>
                      <span>Get Started</span> <FaArrowRight />
                    </button>
                  </NavLink>
                </div>
              </div>

              {/* Right Section - Categories Grid */}
              <div className='grid flex-grow grid-cols-2 gap-3 lg:grid-cols-3 ml-5'>
                {[
                  "Career Coaches",
                  "Business Mentors",
                  "Creative Mentors",
                  "Tech Experts",
                  "Marketing Gurus",
                  "Finance Advisors",
                  "Wellness Coaches",
                  "Education Mentors",
                  "Social Impact Leaders",
                ].map((category, index) => (
                  <a
                    key={index}
                    href='/'
                    onClick={(e) => e.preventDefault()} // Prevents page reload
                    className='block p-2 lg:p-4 text-center transition duration-300 border rounded-lg shadow-sm bg-white text-gray-800 
                       border-teal-400 hover:bg-teal-500 hover:text-white hover:shadow-lg cursor-not-allowed'
                  >
                    {category}
                  </a>
                ))}
              </div>
            </div>

            {/* Image Section with Overlay */}
            <div className='relative mt-10'>
              <img
                className='object-cover w-full h-56 sm:h-96 rounded-lg shadow-md'
                src={mentee1}
                alt='Mentorship'
              />
              <div className='absolute inset-0 bg-green-900 bg-opacity-30 rounded-lg' />
            </div>
          </div>
        </section>

        {/* TopMentor */}
        <section className='lg:my-8'>

          {/* Mentor Container */}
          <div className='container mx-auto text-center max-w-screen-xl p-2 lg:p-8 flex flex-col justify-center items-center '>
            <div className='mt-10'>

              {/* Top Mentors Button */}
              <div className='flex justify-center'>
                <div className='bg-teal-300 px-2 py-2 w-[150px] rounded-full flex justify-center items-center gap-2 text-sm mx-auto lg:mx-0 mb-2'>
                  <div className='bg-teal-100 px-2 py-2 rounded-full'>
                    <FaChalkboardTeacher className='text-teal-900' />
                  </div>
                  <div className='text-teal-800'>Top Mentors</div>
                </div>
              </div>

              <p className='text-4xl font-semibold text-teal-900 text-center'>Meet Our Professional Mentors</p>
            </div>

            {/* Mentors Card Section */}
            <TopMentors />
          </div>

          {/* All Mentor Button */}
          <div className='flex justify-center pb-12'>
            <NavLink to='/mentors'>
              <button className='px-5 md:px-8 py-3 text-white text-lg font-medium bg-teal-600 rounded-full shadow-lg hover:bg-teal-700 hover:scale-105 transition-all duration-500 mt-5 flex justify-center items-center gap-2 md:gap-5 '>
                <span>All Mentors</span> <FaArrowRight />
              </button>
            </NavLink>
          </div>

        </section>

        {/* FAQ's */}
        <section className='bg-gradient-to-br from-teal-800 via-teal-950 to-teal-700 py-8 px-6 md:px-20'>
          
          <div className='py-20 flex flex-col gap-3 container mx-auto text-left max-w-screen-xl p-2 md:p-16'>
          <p className="text-5xl font-semibold text-white py-5">FAQ's</p>
            <div className='w-full text-white'>
              <FaqSet />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='px-8 py-12 text-white bg-black'>
          <div className='max-w-6xl mx-auto flex justify-between items-center text-center'>
            
            <div>
            <p className='text-md text-gray-300'>© 2025 EduHub. All Rights Reserved.</p>
            </div>
            <div className="flex flex-row gap-3 text-gray-300 items-center">
              <a href="/" className="hover:text-gray-500 transition-colors duration-500">Terms of service</a>
              <a href="/" className="hover:text-gray-500 transition-colors duration-500">Privacy Policy</a>
              <a href="/" className="hover:text-gray-500 transition-colors duration-500">License</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;
