import React from "react";

const FeaturesCard = ({ feature }) => {
  return (
    <>
      <div className='md:max-w-md text-center p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 flex flex-col justify-between duration-700 bg-teal-100 hover:bg-white'>
        <h6 className='text-xl font-semibold text-teal-900 mb-3'>{feature.title}</h6>
        <p className='text-sm text-gray-700 mb-4'>{feature.description}</p>
        <a
          href={feature.link}
          className='text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-200'
        >
          Learn More
        </a>
      </div>
    </>
  );
};

export default FeaturesCard;
