import React, { useState } from "react";
import { BiErrorAlt, BiCalendar, BiTime } from "react-icons/bi";
import { Button, Modal, Spin } from "antd";
import { useNavigate ,useLocation, Navigate} from "react-router-dom";
import bookingApi from "../apiManager/booking"
import { LogIn } from "lucide-react";
import useUserStore from "@/store/user";

const ServiceCardUserSide = ({ service, username, bookings, mentor, fetchBookings }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const navigate = useNavigate();
  const {user} = useUserStore();
  const location = useLocation();


  const showModal = () => {
   
    if(!user){
      removeToken();
        return <Navigate to={`/signin?redirect=${location.pathname}`}/>
    }
    fetchBookings()
    setIsModalVisible(true);
    if (service.courseType === "one-on-one") {
      fetchAvailableSlots();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      // Use the availability array from the service
      const slots = service.availability || [];

      // Format available slots
      const formattedSlots = slots.flatMap(day =>
        day.timeSlots.map(slot => ({
          date: day.date,
          startTime: slot.startTime,
          endTime: slot.endTime
        }))
      );

      setAvailableSlots(formattedSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const isSlotBooked = (date, startTime, endTime) => {
    return bookings.some(booking => {
      // For one-on-one sessions
      if (booking.serviceType === "one-on-one") {
        return (
          booking.service._id === service._id &&
          booking.bookingDate === date &&
          booking.startTime === startTime &&
          booking.endTime === endTime
        );
      }
      // For fixed-course sessions
      return (
        booking.service._id === service._id &&
        new Date(booking.sessionDate).toISOString() === date
      );
    });
  };

  const handleSlotSelect = async (slot, service) => {

    console.log(service);
    console.log(slot);


    if (isSlotBooked(slot.date, slot.startTime, slot.endTime)) {
      return;
    }

    try {
      const bookingData = {
        serviceId: service._id,


        bookingDate: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        duration: service.duration


      };

      const response = await bookingApi.bookService(bookingData);
      console.log(response);
      navigate(`/mentor/${username}/service/${service._id}/payment`, {
        state: {
          service,
          slotDetails: {
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            duration: service.duration,
            price: service.price,
            bookingId: response.data.booking._id
          },
          mentor
        }

      });
    } catch (error) {
      console.log(error);

    };

  };


  const handleFixedCourseBooking = async (service) => {
    console.log(service);

    console.log(service._id);

    try {
      const bookingData = {
        serviceId: service._id,
        startTime: service.fixedStartTime,
        bookingDate: service.fromDate,
        duration: service.duration // for fixed courses
        

      };

      const response = await bookingApi.bookService(bookingData);
      console.log("bookingId response: ", response);
      navigate(`/mentor/${username}/service/${service._id}/payment`, {
        state: {
          service,
          slotDetails: {
            date: service.fromDate,
            startTime: service.fixedStartTime,
            // endTime: slot.endTime,
            duration: service.duration,
            price: service.price,
            bookingId: response.data.booking._id
          },
          mentor
        }

      });
    } catch (error) {
      console.log(error);

    };
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{service.serviceName}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-teal-600 font-semibold">${service.price}</span>
          <span className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded">
            {service.courseType}
          </span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500 flex items-center">
            <BiTime className="mr-1" /> {service.duration} mins
          </span>
        </div>

        <Button
          type="primary"
          onClick={showModal}
          className="w-full bg-teal-500 hover:bg-teal-600"
        >
          Book Now
        </Button>
      </div>

      {/* Modal for slot selection */}
      <Modal
        title={`Book ${service.serviceName}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {service.courseType === "one-on-one" ? (
          <div>
            <h4 className="font-semibold mb-4">Select Available Time Slot</h4>

            {loadingSlots ? (
              <div className="flex justify-center">
                <Spin />
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableSlots.map((slot, index) => {
                  const isBooked = isSlotBooked(slot.date, slot.startTime, slot.endTime);
                  return (
                    <div
                      key={index}
                      onClick={() => !isBooked && handleSlotSelect(slot, service)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${isBooked
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "hover:bg-teal-50 hover:border-teal-300"
                        }`}
                    >
                      <div className="flex items-center mb-1">
                        <BiCalendar className="mr-2" />
                        <span>{new Date(slot.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <BiTime className="mr-2" />
                        <span>
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      {isBooked && (
                        <span className="text-xs text-red-500 mt-1 block">Booked</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BiErrorAlt className="mx-auto text-4xl text-orange-500 mb-4" />
                <p>No available slots for this service</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p>This is a {service.courseType} service running from {new Date(service.fromDate).toLocaleDateString()} to {new Date(service.toDate).toLocaleDateString()}.</p>
            <p className="mt-2">Scheduled days: {service.fixedDays.join(", ")} at {service.fixedStartTime}-{service.fixedEndTime}</p>
            <div className="flex justify-end mt-4">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                className="ml-2 bg-teal-500 hover:bg-teal-600"
                onClick={() => handleFixedCourseBooking(service)}
              >
                Proceed to Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServiceCardUserSide;