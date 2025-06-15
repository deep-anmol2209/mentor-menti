import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import serviceAPI from '../apiManager/service';
import bookingApi from "../apiManager/booking"

const BookingPages = () => {
  const { username, serviceId } = useParams();
  const navigate = useNavigate();
  const [availability, setAvailability] = useState([]);
  // const [service, setService] = useState({ price: 1, courseType: "one-on-one" });
  const [loading, setLoading] = useState(true);
const location= useLocation();

const { 
  service,
  slotDetails
} = location.state || {}; 
console.log(location.state);
console.log(service);
// const {fromDate, startTime, courseType, duration, price, endTime }= service
const {date, startTime, endTime= "", duration, price}= slotDetails



  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        const res = await serviceAPI.getServiceById(serviceId);
        setService(res?.data?.service || {});
        setAvailability(res?.data?.service?.availability || []);
      } catch (error) {
        console.error("Error fetching service detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetail();
  }, [serviceId]);

  const onBookSession = async() => {

    try {
      const bookingData = {
        serviceId: serviceId,
        ...(service.courseType === "one-on-one"
          ? {
              bookingDate: date,
              startTime: startTime,
              endTime: endTime,
              duration: duration
            }
          : {
              bookingDate: date,
              duration:duration // for fixed courses
            }),
      };
  
      const response = await bookingApi.bookService(bookingData);
console.log(response);

      navigate(`/mentor/${username}/service/${serviceId}/payment`, {
        state: {
          service,
          slotDetails: {
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            duration: service.duration,
            price: service.price
          }
        }
      });
      return response;
    } catch (error) {
      console.error("Booking creation failed:", error);
      throw error;
    }
  
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-semibold text-center text-orange-color mb-6">
          Book Your Session
        </h2>
        
        {service.courseType === "fixed-course" && (
          <>
            <div className="flex justify-between items-center mt-6">
              <div>
                <span className="text-xl font-semibold text-gray-700">Start Date:</span>
                <span className="text-lg text-orange-color ml-2">
                  {new Date(service?.fromDate).toLocaleDateString("en-IN", {
                    weekday: 'long',
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </div>
              <div>
                <span className="text-xl font-semibold text-gray-700">End Date:</span>
                <span className="text-lg text-orange-color ml-2">
                  {new Date(service?.toDate).toLocaleDateString("en-IN", {
                    weekday: 'long',
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xl font-semibold text-gray-700">Time:</span>
              <span className="text-lg text-orange-color ml-2">
                {service.fixedStartTime} - {service.fixedEndTime}
              </span>
            </div>
            <button
              onClick={() => onBookSession(
                service.fromDate, 
                service.fixedStartTime, 
                service.fixedEndTime
              )}
              className="w-full mt-6 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Book This Course
            </button>
          </>
        )}

        {service.courseType === "one-on-one" && (
          availability.length > 0 ? (
            availability.map((slotDay, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700">
                  {new Date(slotDay.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="flex flex-wrap gap-4 mt-2">
                  {slotDay.timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => onBookSession(
                        slotDay.date,
                        slot.startTime,
                        slot.endTime
                      )}
                      className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-300"
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              No available slots at the moment. Please check back later.
            </p>
          )
        )}

        <div className="flex justify-between items-center mt-6">
          <div>
            <span className="text-xl font-semibold text-gray-700">Price:</span>
            <span className="text-lg text-orange-color ml-2">₹{service?.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPages;