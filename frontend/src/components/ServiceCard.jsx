// import React from "react";
// import { FaPhone, FaEdit } from "react-icons/fa"; // Example icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardUser } from "@fortawesome/free-solid-svg-icons";
// const ServiceCard = ({ service, onEdit }) => {
//   return (
//     <div className='p-4 mb-4 bg-white border rounded-lg shadow-lg'>
//       {/* Service Icon */}
//       <div className='flex items-center justify-between mb-3'>
//         <div className='flex items-center gap-3'>
//           <FaPhone
//             className='text-teal-600'
//             size={24}
//           />{" "}
//           {/* Example icon */}
//           <h3 className='text-xl font-semibold text-gray-800'>{service?.serviceName}</h3>
//         </div>
//         {/* Enable/Disable Button */}
//         <button
//           // onClick={onActive}
//           className={`${service?.active ? "bg-green-500" : "bg-red-500"} text-white px-3 py-1 rounded-md`}
//         >
//           {service?.active ? "Enabled" : "Disabled"}
//         </button>
//       </div>

//       {/* Service Description */}
//       <p className='mb-3 text-gray-600'>{service?.description}</p>

//       {/* Service Price */}
//       <div className='flex flex-col justify-between px-3 mb-3'>
//         <p className='text-md font-semibold text-gray-500 '>
//           {" "}
//           Price: <span className='text-lg font-bold text-teal-700 '>₹{service?.price}</span>
//         </p>
//         <p className='text-md font-semibold text-gray-500 '>
//           {" "}
//           Duration: <span className='text-lg font-bold text-teal-700 '>{service?.duration} mins.</span>
//         </p>
//         <p className='text-md font-semibold text-gray-500 '>
//           {" "}
//           Course Type: <span className='text-lg font-bold text-teal-700 '>{service?.courseType}</span>
//         </p>

//         {service?.courseType === "one-on-one" ? (
//           <p></p>
//         ) : (
//           <>
//             <p className='text-md font-semibold text-gray-500 '>
//               {" "}
//               From Date: <span className='text-lg font-bold text-teal-700 '>{service?.fromDate}</span>
//             </p>
//             <p className='text-md font-semibold text-gray-500 '>
//               {" "}
//               To Date: <span className='text-lg font-bold text-teal-700 '>{service?.toDate}</span>
//             </p>
//             <p className='text-md font-semibold text-gray-500 '>
//               {" "}
//               Start Time: <span className='text-lg font-bold text-teal-700 '>{service?.fixedStartTime}</span>
//             </p>
//             <p className='text-md font-semibold text-gray-500 '>
//               {" "}
//               End Time: <span className='text-lg font-bold text-teal-700 '>{service?.fixedEndTime}</span>
//             </p>
//             <div className='flex flex-col text-md font-semibold text-gray-500 '>
//               {" "}
//               Days in week:
//               <div className="flex flex-row flex-wrap">
//               {service?.fixedDays.map((day)=>(
//                 <span className='text-lg font-bold text-teal-700 pr-5'>{day}</span>
//               ))}
//                 </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Action Buttons: Edits */}
//       <div className='flex items-center justify-end gap-4'>
//         <button
//           onClick={onEdit}
//           className='flex items-center gap-1 text-blue-500 hover:text-blue-700'
//         >
//           <FaEdit size={16} />
//           Edit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ServiceCard;

// import React from "react";
// import { FaPhone, FaEdit } from "react-icons/fa";

// const ServiceCard = ({ service, onEdit }) => {
//   return (
//     <div className="p-4 mb-6 bg-white border rounded-lg shadow-md">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
//         <div className="flex items-center gap-3">
//           <FaPhone className="text-teal-600" size={24} />
//           <h3 className="text-xl font-semibold text-gray-800">{service?.serviceName}</h3>
//         </div>
//         <button
//           className={`text-sm px-3 py-1 rounded-md ${
//             service?.active ? "bg-green-500" : "bg-red-500"
//           } text-white`}
//         >
//           {service?.active ? "Enabled" : "Disabled"}
//         </button>
//       </div>

//       {/* Description */}
//       <p className="mb-4 text-gray-600">{service?.description}</p>

//       {/* Price, Duration, Course Type */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 text-gray-700">
//         <p>
//           <span className="font-semibold">Price:</span><br/>
//           <span className="text-teal-700 font-bold">₹{service?.price}</span>
//         </p>
//         <p>
//           <span className="font-semibold">Duration:</span><br/>
//           <span className="text-teal-700 font-bold">{service?.duration} mins</span>
//         </p>
//         <p>
//           <span className="font-semibold">Course Type:</span><br/>
//           <span className="text-teal-700 font-bold">{service?.courseType}</span>
//         </p>
//       </div>

//       {/* Fixed-course details */}
//       {service?.courseType === "fixed-course" && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mb-4 text-gray-700">
//           <p>
//             <span className="font-semibold">From:</span><br/>
//             <span className="text-teal-700 font-bold">{service?.fromDate}</span>
//           </p>
//           <p>
//             <span className="font-semibold">To:</span><br/>
//             <span className="text-teal-700 font-bold">{service?.toDate}</span>
//           </p>
//           <p>
//             <span className="font-semibold">Start Time:</span><br/>
//             <span className="text-teal-700 font-bold">{service?.fixedStartTime}</span>
//           </p>
//           <p>
//             <span className="font-semibold">End Time:</span><br/>
//             <span className="text-teal-700 font-bold">{service?.fixedEndTime}</span>
//           </p>
//           <div className="sm:col-span-2">
//             <p className="font-semibold">Days in Week:</p>
//             <div className="flex flex-wrap gap-2 mt-1">
//               {service?.fixedDays.map((day, index) => (
//                 <span key={index} className="px-2 py-1 text-sm bg-teal-100 text-teal-700 rounded-md">
//                   {day}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Action */}
//       <div className="flex justify-end">
//         <button onClick={onEdit} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
//           <FaEdit size={16} />
//           Edit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ServiceCard;

import React from "react";
import { FaPhone, FaEdit } from "react-icons/fa";
import dayjs from "dayjs";

const ServiceCard = ({ service, onEdit }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    return dateString ? dayjs(dateString).format("MMM D, YYYY") : "N/A";
  };

  // Group availability by date for better display
  // const groupAvailabilityByDate = (availability) => {
  //   if (!availability || !Array.isArray(availability)) return [];

  //   return availability.reduce((acc, dateSlot) => {
  //     if (dateSlot.date && dateSlot.timeSlots?.length > 0) {
  //       const formattedDate = formatDate(dateSlot.date);
  //       acc[formattedDate] = acc.push[dateSlot.timeSlots];
  //       console.log(formattedDate);

  //     }
  //     return acc;
  //   }, {});
  // };

  const groupAvailabilityByDate = (availability) => {
    if (!availability || !Array.isArray(availability)) return {};

    return availability.reduce((acc, dateSlot) => {
      if (dateSlot.date && dateSlot.timeSlots?.length > 0) {
        const formattedDate = formatDate(dateSlot.date);

        // Initialize array if it doesn't exist
        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }

        // Append all time slots to that date
        acc[formattedDate].push(...dateSlot.timeSlots);
      }
      return acc;
    }, {});
  };

  const groupedAvailability = groupAvailabilityByDate(service?.availability);

  return (
    <div className="relative flex flex-col justify-between p-6 mb-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div>
        {/* Top: Icon + Title + Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center p-2 bg-teal-100 rounded-full w-8 h-8">
            <FontAwesomeIcon
              icon={faChalkboardUser}
              size="sm"
              className="text-teal-600"
            />
          </div>
          <h3 className="text-xl lg:text-2xl font-semibold text-gray-900">
            {service?.serviceName}
          </h3>
        </div>

        <span
          className={`absolute top-5 right-5 text-xs font-medium px-3 py-1 rounded-full ${
            service?.active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {service?.active ? "Enabled" : "Disabled"}
        </span>
      </div>

      {/* Description */}
      <p className="mb-4 text-gray-600 text-sm">{service?.description}</p>

      {/* Grid Info */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 text-gray-800 text-[12px] lg:text-sm mb-3 lg:mb-5">
        <Info label="Price" value={`₹${service?.price}`} />
        <Info
          label="Duration"
          value={`${
            service?.duration > 60
              ? service?.duration / 60 + " Hrs"
              : service?.duration + " Mins"
          }`}
        />
        <Info
          label="Course Type"
          value={
            service?.courseType === "one-on-one" ? "One-on-One" : "Fixed Course"
          }
        />
      </div>

      {service?.courseType === "fixed-course" ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 text-gray-800 text-[12px] lg:text-sm mb-3 lg:mb-5">
            <Info label="From Date" value={formatDate(service?.fromDate)} />
            <Info label="To Date" value={formatDate(service?.toDate)} />
            <Info label="Start Time" value={service?.fixedStartTime || "N/A"} />
            <Info label="End Time" value={service?.fixedEndTime || "N/A"} />
          </div>
          <div className="w-full">
            <p className="text-gray-600 text-[12px] lg:text-lg mb-1">
              Days in Week:
            </p>
            <div className="flex flex-wrap gap-2 pb-2">
              {service?.fixedDays?.length > 0 ? (
                service.fixedDays.map((day, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium"
                  >
                    {day}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">No days selected</span>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="sm:col-span-2 lg:col-span-3">
          <p className="text-gray-800 text-[12px] lg:text-mdmb-1">
            Availability:
          </p>
          {Object.keys(groupedAvailability).length === 0 ? (
            <p className="text-gray-500 italic">No availability slots</p>
          ) : (
            Object.entries(groupedAvailability).map(([date, timeSlots]) => (
              <div key={date} className="flex items-center">
                <div className="text-gray-700 text-[12px] lg:text-md font-bold my-2">
                  {date}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {timeSlots.map((slot, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                      >
                        {slot.startTime} - {slot.endTime}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      </div>

      {/* Action: Edit */}
      <div className="flex justify-end border-t pt-4">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          <FaEdit size={14} />
          Edit Service
        </button>
      </div>
    </div>
  );
};

// Reusable Info Component
const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500 font-medium">{label}</p>
    <p className="text-gray-900 font-semibold">{value || "N/A"}</p>
  </div>
);

export default ServiceCard;
