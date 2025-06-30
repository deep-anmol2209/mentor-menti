import React, { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { Spin } from "antd";
import { useParams } from "react-router-dom";
import mentorApi from "@/apiManager/mentor";
import bookingApi from "@/apiManager/booking";
import { BiErrorAlt } from "react-icons/bi";
import ServiceCardUserSide from "@/components/ServiceCardUserSide";

const MentorProfile = () => {
  const { username } = useParams();
  const [mentor, setMentor] = useState({});
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        // Fetch mentor details and services
        const mentorResponse = await mentorApi.getMentorsByUsername(username);
        const mentorDetail = mentorResponse?.data?.mentor || {};
        const mentorService = mentorResponse?.data?.services || [];
        
       
        
        setServices(mentorService);
        setMentor(mentorDetail);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, [username]);

  const fetchBookings = async()=>{
 // Fetch bookings for this mentor
 const bookingsResponse = await bookingApi.getBookingsByUsername(username);
 const mentorBookings = bookingsResponse?.data?.bookings || [];
 setBookings(mentorBookings);
 // Access the 'bookings' property
  }
  // Function to check if a time slot is booked
  const isSlotBooked = (serviceId, date, startTime, endTime) => {
    return bookings.some(booking => 
      booking.service._id === serviceId &&
      ((booking.serviceType === "one-on-one" && 
        booking.bookingDate === date &&
        booking.startTime === startTime &&
        booking.endTime === endTime) ||
       (booking.serviceType === "fixed-course" &&
        new Date(booking.sessionDate).toISOString() === date))
    );
  };


  const socialLinks = [
    {
      icon: "fab fa-facebook-f",
      link: "mentor?.profile?.social?.facebook",
    },
    {
      icon: "fab fa-github",
      link: "mentor?.profile?.social?.github",
    },
    {
      icon: "fab fa-instagram",
      link: "mentor?.profile?.social?.instagram",
    },
    {
      icon: "fab fa-twitter",
      link: "mentor?.profile?.social?.twitter",
    },
  ];

  return (
    <>
      <Nav />
      <div className='max-w-6xl mx-auto max-h-fit'>
        {/* Heading Section for All Mentors */}
        <div className='w-full flex flex-col items-center justify-center h-[300px] bg-gray-100'>
          <h1 className='text-center text-2xl md:text-4xl font-semibold py-6'>{mentor.name}</h1>
          <p>{mentor?.profile?.title}</p>
        </div>
      </div>

      {/* Mentor Profile Body Section */}
      <div className='w-full flex flex-col items-center justify-center max-h-fit'>
        {/* Mentor Details Section */}
        <div className='realtive w-full md:w-2/3 flex flex-row my-5 gap-2 md:gap-5 p-2'>
          {/* Profile Left Section */}
          <div className='sticky top-40 bg-teal-50 w-1/3 rounded-xl p-5 max-h-fit flex flex-col items-center'>
            {/* Image and Social link section */}
            <div className='rounded-full '>
              <img
                src={mentor.photoUrl}
                alt='Mentor Profile Image'
                className='rounded-full  border-teal-500'
              />
            </div>

            {/* Mentor Profile Section */}
            <div className='px-2 py-2 flex gap-3 flex-wrap justify-center items-center'>
              {socialLinks.map((link, index) => (
                <div
                  key={index}
                  className='border border-teal-500 w-[30px] h-[30px] rounded-full hover:bg-teal-500 flex justify-center items-center'
                >
                  <i className={`fab ${link.icon} text-teal-500 hover:text-white content-center text-center text-lg w-[50px] h-[50px]`}></i>
                </div>
              ))}
            </div>
          </div>

          {/* Profile right section */}
          <div className='w-2/3 p-3'>
            {/* Mentor Info Section  */}
            <div>
              <p className='text-sm text-teal-500'>Mentor</p>
              <h2 className='text-2xl font-semibold text-gray-700'>{mentor?.name}</h2>
              <p className='text-md text-gray-600'>{mentor?.profile?.title}</p>

              {/* Mentor Skill Tag section */}
              <div className='py-2 flex gap-1 flex-wrap'>
                {(mentor?.profile?.tags || []).map((tag, index) => (
                  <div
                    key={index}
                    className='ring-1 ring-teal-500 px-2 py-1 rounded-lg max-w-fit text-[8px] lg:text-[16px] xl:text-sm text-gray-600 capitalize hover:bg-teal-500 cursor-pointer hover:text-white hover:shadow-xl transition-all duration-500'
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Section separator */}
            <div className=' border border-dashed my-3'></div>

            {/* Mentor Bio Sector */}
            <div>
              <p className='text-md text-gray-700'>Bio Data</p>
              <p className='text-xs text-gray-500 text-justify leading-4'>{mentor?.profile?.bio}</p>
            </div>
          </div>
        </div>

        {/* Mentor's Services Section */}
        <div className='p-6 max-h-fit w-full md:w-2/3'>
            <h3 className='mb-4 text-2xl font-bold text-teal-800'>Book a Session</h3>

            {loading ? (
              <div className='flex items-center justify-center h-full'>
                <Spin size='large' />
              </div>
            ) : services.length > 0 ? (
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                 {services.map((service) => (
      <ServiceCardUserSide
        key={service?._id}
        service={service}
        fetchBookings={fetchBookings}
        username={mentor?.username || username}
        bookings={bookings} // Pass the bookings data
        mentor= {mentor}
      />
    ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-full text-gray-700'>
                <BiErrorAlt className='w-24 h-24 mb-4 text-orange-color' />
                <h3 className='mb-2 text-xl font-semibold'>Oops! No Services Available</h3>
                <p className='mb-6 text-lg text-gray-500'>It seems like there are no services available at the moment. Please check back later!</p>
                <button
                  className='px-6 py-3 text-white bg-orange-color rounded-lg shadow-lg hover:bg-orange-500'
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </button>
              </div>
            )}
          </div>


      </div>

      {/* Footer */}
      <footer className='w-full px-8 py-12 text-white bg-black'>
        <div className='max-w-6xl mx-auto flex flex-col-reverse gap-5 justify-between items-center text-center'>
          <div>
            <p className='text-md text-gray-300'>© 2025 EduHub. All Rights Reserved.</p>
          </div>
          <div className='flex flex-row gap-3 text-gray-300 items-center'>
            <a
              href='/'
              className='hover:text-gray-500 transition-colors duration-500'
            >
              Terms of service
            </a>
            <a
              href='/'
              className='hover:text-gray-500 transition-colors duration-500'
            >
              Privacy Policy
            </a>
            <a
              href='/'
              className='hover:text-gray-500 transition-colors duration-500'
            >
              License
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default MentorProfile;
