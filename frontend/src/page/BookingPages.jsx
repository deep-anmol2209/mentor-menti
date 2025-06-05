import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosInstances from "../apiManager/index"; 
import serviceAPI from '../apiManager/service';


const BookingPages = () => {
  const { username, serviceId } = useParams();
  const navigate = useNavigate();

  // 🔹 Hardcoded availability for debugging
  // const hardcodedAvailability = {
  //   sunday: [{ startTime: "10:00", endTime: "11:00" }, { startTime: "14:00", endTime: "15:00" }],
  //   monday: [{ startTime: "09:00", endTime: "10:00" }],
  // };

  const [availability, setAvailability] = useState({}); // Default to hardcoded
  const [service, setService] = useState({ price: 1 }); // Mock service data, replace with actual API call

  useEffect(()=>{
    const fetchServiceDetail = async() =>{
    try {
      const res = await serviceAPI.getServiceById(serviceId);
      setService(res?.data?.service);
      setAvailability(res?.data?.service?.availability);
    } catch (error) {
      console.log("Error fetching service detail:" , error);
    }
    }
    fetchServiceDetail();
  },[])

  // useEffect(() => {
  //   const fetchAvailability = async () => {
  //     try {
  //       // const response = await AxiosInstances.get(`/availability/${username}?durationInMinutes=60`);
        
  //       console.log("🚀 Full API Response:", response.data); // Log entire response

  //       if (response.data?.availability?.weeklyAvailability) {
  //         setAvailability(response.data.availability.weeklyAvailability);
  //       } else {
  //         console.warn("❌ No 'weeklyAvailability' found in API response. Using hardcoded data.");
  //       }
  //     } catch (error) {
  //       console.error("❌ Error fetching availability:", error?.response?.data || error);
  //     }
  //   };

  //   fetchAvailability();
  // }, [username]);


  const onBookSession = (date, timeSlot) => {
    navigate(`/mentor/${username}/service/${serviceId}/payment`, {
      state: {
        date,
        timeSlot,
        price: service?.price,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-semibold text-center text-orange-color mb-6">
          Book Your Session
        </h2>

        {Object.keys(availability).length === 0 ? (
          <p className="text-center text-gray-500">No available slots at the moment.</p>
        ) : (
          Object.entries(availability).filter(([day, slots]) => Array.isArray(slots)&& slots.length > 0).map(([day, slots]) => (
            <div key={day} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 capitalize">{day}</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {slots.length > 0 ? (
                  slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => onBookSession(day, `${slot.startTime} - ${slot.endTime}`)}
                      className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-300"
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No slots available.</p>
                )}
              </div>
            </div>
          ))
        )}

        <div className="flex justify-between items-center mt-6">
          <div>
            <span className="text-xl font-semibold text-gray-700">Price:</span>
            <span className="text-lg text-orange-color">₹{service?.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPages;
