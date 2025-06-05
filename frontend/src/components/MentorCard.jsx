import React from "react";
import noImage from "../assets/no-image.webp";

const MentorCard = ({ mentor, handleClick }) => {
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
      <div 
      className='max-h-max shadow-xl border border-teal-300 rounded-lg cursor-pointer hover:scale-105 transition-all ease-in-out duration-500'
      onClick={handleClick}
      >
        <div className='bg-white rounded-lg h-[400px] md:h-[500px] flex flex-col '>
          {/* Card left section */}
          <div className='w-full h-[250px] overflow-hidden rounded'>
            {mentor?.photoUrl ? (
              <img
                className='z-5 object-contain w-full h-full rounded-lg shadow-md'
                src={mentor.photoUrl}
                alt='Mentor Profile Photo'
              />
            ) : (
              <img
                className='z-5 object-cover w-full h-full rounded-lg shadow-md'
                src={noImage}
                alt='Profile Image Not Found'
              />
            )}
          </div>

          {/* Card right section */}
          <div className=' p-1 flex flex-col justify-between items-center h-[250px]'>
            <div className='px-2 py-1 text-center  overflow-hidden'>
              <div className='text-3xl md:text-xl xl:text-2xl font-medium text-gray-900 case capitalize hover:text-teal-600'>{mentor?.name}</div>
              <p className='text-teal-700 capitalize text-sm xl:text-md leading-5 pb-2'>{mentor?.profile?.title}</p>
              {/* Mentor Skill Tag section */}
              <div className='px-2 py-2 flex gap-1 flex-wrap'>
                {(mentor?.profile?.tags).map((tag, index) => (
                  <div
                    key={index}
                    className='bg-teal-500 px-2 py-1 rounded-md max-w-fit text-[8px] lg:text-[10px] xl:text-xs text-white capitalize '
                  >
                    {tag}
                  </div>
                ))}
              </div>
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
        </div>
      </div>
    </>
  );
};

export default MentorCard;
