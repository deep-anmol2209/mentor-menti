import React, { useEffect, useState } from 'react';
import {Table,Button,  Input, Modal, Form, Spin, Select, DatePicker, TimePicker} from 'antd';
import Dashboard from './dashboard';
import { BiErrorAlt, BiCalendar, BiTime } from "react-icons/bi";
import booking from '../../apiManager/booking';
import useUserStore from '@/store/user';
import moment from 'moment';
import { FiPlus } from "react-icons/fi";
import { useCallback } from 'react';

import toast from 'react-hot-toast';

const Bookings = () => {

  const { user } = useUserStore();
  console.log(user.username);
  const [form] = Form.useForm();

  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRescheduleModalVisible, setIsRescheduleModalVisible] = useState(false);
  const [isNewSlotModalVisible, setIsNewSlotModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' or 'past'
  const [editBooking, setEditBooking]= useState()
  const [availableSlots, setAvailableSlots] = useState([]);
   const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    
    const res = user.role==="mentor"?( await booking.getMentorBookings()): (await booking.getStudentBookings());
    console.log(res);
    
    setBookings(res?.data?.bookings);
    setLoading(false);
  };
  

  useEffect(() => {
    fetchBookings();
  }, []);

  const closeModal = useCallback(() => {
  if(isRescheduleModalVisible){
    setIsRescheduleModalVisible(false)
  }else{
    setIsNewSlotModalVisible(false)
  }
   
  }, []);
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "upcoming") {
      return booking.status=== 'confirmed' || booking.status=== 'pending'; // Future bookings
    } else if (activeTab === "past"){
      return booking.status=== "completed"; // Past bookings
    }
    else{
      return booking.status === 'rescheduled' || booking.status === 'reschedulerequest';
    }
  });
console.log(filteredBookings);

const fetchAvailableSlots = async (record) => {
  setLoadingSlots(true);
  try {
    // Use the availability array from the service
    console.log(record.rescheduleSlots);
    
    const slots = record.rescheduleSlots || [];
    console.log(slots);
    
    // Format available slots
    const formattedSlots = slots.flatMap(day =>
      day.timeSlot.map(slot => ({
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

const formatFormValues = useCallback((values) => {
  const formattedValues = { ...values };
  
  if (formattedValues.availability) {
    formattedValues.availability = formattedValues.availability
      .filter(slot => slot.date && slot.startTime && slot.endTime)
      .map(slot => {
        const { startTime, endTime } = slot;
        return {
          date: slot.date.format("YYYY-MM-DD"),
          timeSlot: [{
            startTime: startTime.format("HH:mm"),
            endTime: endTime.format("HH:mm")
          }]
        };
      });
  }
  
  return formattedValues;
}, [bookings]);

const handleSlotSelect = async (slot) => {
  try {
    const bookingData = {
      bookingId: editBooking._id,  // Send bookingId in body instead of URL
      bookingDate: slot.date,      // Modified fields
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: "rescheduled",
    };
    
    // Send as PATCH with bookingId in body
    const response = await booking.rescheduleBooking(bookingData);
    toast.success("Rescheduled successfully!");
    fetchBookings(); // Refresh bookings list
    setIsRescheduleModalVisible(false);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to reschedule");
  }
};
const handleRecheduleSubmit = useCallback(async (values) => {
  setLoading(true);
  try {
    const formattedValues = formatFormValues(values);
    
    if (!formattedValues.availability?.length) {
      throw new Error("Please add at least one availability slot");
    }

    if (!editBooking?._id) {
      throw new Error("Booking information is missing");
    }

    // Check for time conflicts (similar to initiateBooking)
    const conflictResponses = await Promise.all(
      formattedValues.availability.map(async slot => {
        return await booking.checkTimeConflict({
          mentor: editBooking.mentor,
          date: slot.date,
          startTime: slot.timeSlot.startTime,
          endTime: slot.timeSlot.endTime,
          excludeBookingId: editBooking._id
        });
      })
    );

   // Extract just the conflict booleans
   const hasConflicts = conflictResponses.some(response => response.conflict);

   console.log('Conflict check results:', {
     responses: conflictResponses,
     hasConflicts
   });

   if (hasConflicts) {
     throw new Error("One or more slots are already booked");
   }

    const bookingData = {
      ...editBooking,
      rescheduleSlots: formattedValues.availability,
      status: "reschedulerequest",
      rescheduleRequested: true
    };

    const response = await booking.updateBooking(bookingData);
    toast.success("Reschedule request sent successfully!");
    setIsRescheduleModalVisible(false);
    fetchBookings();
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
}, [formatFormValues, editBooking]);


const columns = [
  {
    title: "Date",
    dataIndex: "bookingDate",
    key: "date",
    render: (text) => moment(text).format("DD MMM YYYY"),
  },
  {
    title: "Time",
    dataIndex: "startTime",
    key: "time",
    render: (text) => text,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <span className={`${
        status === "pending" ? "text-red-500" : "text-green-500"
      } font-semibold`}>
        {status}
      </span>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (price) => `₹${price}`,
  },
];

// Add Actions column conditionally
if (user.role === 'mentor' || user.role === 'student') {
  columns.push({
    title: "Actions",
    key: "actions",
    render: (_, record) => {
      // Show actions for:
      // - All bookings if mentor
      // - Only reschedulerequest bookings if student
      if (user.role === 'mentor' || (user.role === 'student' && record.status === 'reschedulerequest')) {
        return (
          <div className="flex gap-2">
            {user.role=== "mentor"? (<Button
              type="link"
              onClick={() => handleRescheduleModal(record)}
            >
             Reschedule
            </Button>): (<Button
              type="link"
              onClick={() => handleNewSlotModal(record)}
            >
          select new slot
            </Button>)}
           
            <Button
              type="link"
              danger
              onClick={() => handleCancelBooking(record)}
            >
              Cancel
            </Button>
          </div>
        );
      }
      return null; // Don't show actions for other student bookings
    }
  });
}

const handleRescheduleModal = (record) => {
  const initialValues = {
    availability: [{
      date: moment(record.bookingDate),
      startTime: moment(record.startTime, 'HH:mm'),
      endTime: moment(record.endTime, 'HH:mm')
    }]
  };
  
  setEditBooking(record);
  form.resetFields();
  form.setFieldsValue(initialValues);
  setIsRescheduleModalVisible(true);
};


const handleNewSlotModal = (record) => {
  
  setEditBooking(record);
  fetchAvailableSlots(record);
  setIsNewSlotModalVisible(true);
 
};

const handleCancelBooking = async (booking) => {
  try {
    const confirm = window.confirm("Are you sure you want to cancel this session?");
    if (!confirm) return;

    await booking.cancelBooking(booking._id); // <-- you create this API

    fetchBookings(); // Refresh bookings
  } catch (error) {
    console.error("Cancel failed:", error);
  }
};

  const rowClassName = (record) => {
    if (record.status === "pending") {
      return "bg-orange-200"; // Light orange background for pending status
    } else if (record.status === "confirmed") {
      return "bg-green-100"; // Light green background for confirmed status
    }
    return "bg-white"; // Default white background
  };


  return (
    <>
      <Dashboard>
      <div className='p-6 mx-auto bg-white rounded-lg shadow-lg h-full'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Your Bookings </h2>

        <div className="flex my-6 space-x-6">
          <Button
            type={activeTab === "upcoming" ? "primary" : "default"}
            onClick={() => setActiveTab("upcoming")}
            style={{
              backgroundColor: activeTab === "upcoming" ? "#FFB74D" : "#fff", // Light orange for active tab
              color: activeTab === "upcoming" ? "#fff" : "#FFB74D",
              borderColor: "#FFB74D",
              fontWeight: "500",
              padding: "8px 16px",
              borderRadius: "5px",
            }}
          >
            Upcoming Bookings
          </Button>
          <Button
            type={activeTab === "past" ? "primary" : "default"}
            onClick={() => setActiveTab("past")}
            style={{
              backgroundColor: activeTab === "past" ? "#FFB74D" : "#fff",
              color: activeTab === "past" ? "#fff" : "#FFB74D",
              borderColor: "#FFB74D",
              fontWeight: "500",
              padding: "8px 16px",
              borderRadius: "5px",
            }}
          >
            Past Bookings
          </Button>

          <Button
            type={activeTab === "rescheduled" ? "primary" : "default"}
            onClick={() => setActiveTab("rescheduled")}
            style={{
              backgroundColor: activeTab === "rescheduled" ? "#FFB74D" : "#fff",
              color: activeTab === "rescheduled" ? "#fff" : "#FFB74D",
              borderColor: "#FFB74D",
              fontWeight: "500",
              padding: "8px 16px",
              borderRadius: "5px",
            }}
          >
            Rescheduled Bookings
          </Button>
        </div>

        {/* Loading spinner while fetching data */}
        {loading ? (
          <div className="flex justify-center my-6">
            <Spin size="large" />
          </div>
        ) : (
          // Table to display booking information
          <Table
            columns={columns}
            dataSource={filteredBookings}
            pagination={{ pageSize: 5 }}
            rowKey={(record) => record._id}
            rowClassName={rowClassName} // Apply row color based on status
            style={{
              backgroundColor: "#F9FAFB", // Very light gray background for table
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
            className="rounded-lg"
          />
        )}
<Modal
          title={"Reschedule details"}
          open={isRescheduleModalVisible}
          onCancel={closeModal}
          footer={null}
          width={800}
          destroyOnClose
        >
          <Form
            form={form}
            onFinish={handleRecheduleSubmit}
            layout="vertical"
          >
            
           
              <Form.List name='availability'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        className="flex gap-2 mb-2 items-end"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "date"]}
                          label="Date"
                          className="flex-1"
                          rules={[{ required: true, message: 'Select date' }]}
                        >
                          <DatePicker className="w-full" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "startTime"]}
                          label="Start Time"
                          className="flex-1"
                          rules={[{ required: true, message: 'Select start time' }]}
                        >
                          <TimePicker format='HH:mm' minuteStep={15} className="w-full" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "endTime"]}
                          label="End Time"
                          className="flex-1"
                          rules={[{ required: true, message: 'Select end time' }]}
                        >
                          <TimePicker format='HH:mm' minuteStep={15} className="w-full" />
                        </Form.Item>
                        <Button
                          onClick={() => remove(name)}
                          danger
                          className="mb-7"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type='dashed'
                        onClick={() => add()}
                        block
                        icon={<FiPlus />}
                      >
                        Add Availability Slot
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>


            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              block
              size="large"
            >
              Reschedule Service
            </Button>
          </Form>
        </Modal>

        <Modal
        title={`Time Slots`}
        open={isNewSlotModalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
          <div>
            <h4 className="font-semibold mb-4">Select Available Time Slot</h4>

        
            {loadingSlots? (  <div className="flex justify-center">
                <Spin />
              </div>): availableSlots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableSlots.map((slot, index) => {
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleSlotSelect(slot)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors 
                        hover:bg-teal-50 hover:border-teal-300
                        `}
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
        
         
        
      </Modal>
      </div>
      </Dashboard>
    </>
  )
}

export default Bookings