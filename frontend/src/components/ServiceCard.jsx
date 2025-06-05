// import React from "react";
// import { FaPhone, FaEdit } from "react-icons/fa"; // Example icons

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

const ServiceCard = ({ service, onEdit }) => {
  return (
    <div className="relative p-6 mb-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Top: Icon + Title + Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-full">
            <FaPhone className="text-teal-600" size={22} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">{service?.serviceName}</h3>
        </div>

        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            service?.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {service?.active ? "Enabled" : "Disabled"}
        </span>
      </div>

      {/* Description */}
      <p className="mb-4 text-gray-600 text-sm">{service?.description}</p>

      {/* Grid Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-800 text-sm mb-5">
        <Info label="Price" value={`₹${service?.price}`} />
        <Info label="Duration" value={`${service?.duration} mins`} />
        <Info label="Course Type" value={service?.courseType} />

        {service?.courseType === "fixed-course" && (
          <>
            <Info label="From Date" value={service?.fromDate} />
            <Info label="To Date" value={service?.toDate} />
            <Info label="Start Time" value={service?.fixedStartTime} />
            <Info label="End Time" value={service?.fixedEndTime} />
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-gray-600 font-medium mb-1">Days in Week:</p>
              <div className="flex flex-wrap gap-2">
                {service?.fixedDays.map((day, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </>
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
    <p className="text-gray-900 font-semibold">{value}</p>
  </div>
);

export default ServiceCard;
