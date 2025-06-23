import React, { useEffect, useState } from 'react';
import {Table,Button,  Input, Modal, Form, Spin, Select, DatePicker, TimePicker} from 'antd';
import Dashboard from './dashboard';
import { BiErrorAlt, BiCalendar, BiTime } from "react-icons/bi";
import bookingApi from "../../apiManager/booking"
import useUserStore from '@/store/user';
import { AiOutlineEye } from "react-icons/ai";
import moment from 'moment';
import { FiPlus } from "react-icons/fi";
import { useCallback } from 'react';

import toast from 'react-hot-toast';
import service from '@/apiManager/service';

const Bookings = () => {

  const { user } = useUserStore();
  console.log(user.username);
  const [form] = Form.useForm();

  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRescheduleModalVisible, setIsRescheduleModalVisible] = useState(false);
  const [isNewSlotModalVisible, setIsNewSlotModalVisible] = useState(false);
  const [isEditServiceModalVisible, setisEditServiceModalVisible]= useState(false)
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' or 'past'
  const [editBooking, setEditBooking]= useState()
  const [availableSlots, setAvailableSlots] = useState([]);
   const [loadingSlots, setLoadingSlots] = useState(false);
   const [selectedBooking, setselectedBooking]= useState(null)

  const fetchBookings = async () => {
    setLoading(true);
    
    const res = user.role==="mentor"?( await bookingApi.getMentorBookings()): (await bookingApi.getStudentBookings());
    console.log(res);
    
    setBookings(res?.data?.bookings);
    setLoading(false);
  };
  

  useEffect(() => {
    fetchBookings();
  }, []);

  const closeModal = useCallback(() => {
    console.log("hello modal");
    
  if(isRescheduleModalVisible){
    setIsRescheduleModalVisible(false)
  }else{
    setIsNewSlotModalVisible(false)
  }
   
  }, []);
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "upcoming") {
      return booking.status=== 'confirmed' || booking.status=== 'pending' || booking.status === 'rescheduled'; // Future bookings
    } else if (activeTab === "past"){
      return booking.status=== "completed" || booking.status==="cancelled"; // Past bookings
    }
    else{
      return   booking.status === 'reschedulerequest';
    }


  });

  // Filter duplicates in fixed-course bookings
const fixedCourseFilteredBookings = (() => {
  const seen = new Set();
  return filteredBookings.filter((booking) => {
    if (booking.service.courseType === "fixed-course") {
      if (seen.has(booking.service._id)) {
        return false;
      }
      seen.add(booking.service._id);
      return true;
    }
    return true;
  });
})();
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
const handleCancelBooking = async (booking) => {
  try {
    const confirm = window.confirm("Are you sure you want to cancel this session?");
    if (!confirm) return;

    await bookingApi.cancelBooking(booking._id); // <-- you create this API

    fetchBookings(); // Refresh bookings
  } catch (error) {
    console.error("Cancel failed:", error);
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
    const response = await bookingApi.rescheduleBooking(bookingData);
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
        return await bookingApi.checkTimeConflict({
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
      service: editBooking.service._id,
      rescheduleSlots: formattedValues.availability,
      status: "reschedulerequest",
      rescheduleRequested: true
    };

    const response = await bookingApi.updateBooking(bookingData);
    toast.success("Reschedule request sent successfully!");
    setIsRescheduleModalVisible(false);
    fetchBookings();
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
}, [formatFormValues, editBooking]);


const handleUserDetails=(record,user)=>{
  console.log("handleUserDetails: ",user, record);
  
  setselectedBooking(record)
  console.log(selectedBooking);
  
}

// const uniqueFixedCourseMap = new Map();

// const filteredBookingByFixedCourse = bookings.filter(booking => {
//   if (booking.service.courseType === "fixed-course") {
//     if (uniqueFixedCourseMap.has(booking.service._id)) {
//       return false; // duplicate, skip
//     } else {
//       uniqueFixedCourseMap.set(booking.service._id, true);
//       return true; // first occurrence
//     }
//   }
//   return true; // non-fixed-course, include all
// });


const columns = [

  {
    title: "Service Name",
    dataIndex: "service",
    key: "serviceName",
    render: (service) => service.serviceName
  },
  {
    title: "Service Date",
    dataIndex: "bookingDate",
    key: "serviceDate",
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
    title: "Meeting Link",
    dataIndex: "meetingLink",
    key: "meetingLink",
    render: (text) => (<a href={text}>Join link</a>),
  },

  {
    title: "User Details",
    dataIndex: "user",
    key: "userDetails",
    render: (user,record) => (
      <AiOutlineEye
      size={25}
        onClick={() => {
          console.log("user detail: ",record);
          
          if (record?.service?.courseType !== "fixed-course") {
            
            
            handleUserDetails(record,user);
          }
        }}
        style={{
          color: record?.service?.courseType === "fixed-course" ? "#ccc" : "#1890ff",
          cursor: record?.service?.courseType === "fixed-course" ? "not-allowed" : "pointer",
          pointerEvents: record?.service?.courseType === "fixed-course" ? "none" : "auto",
        }}
        />)
  },
];

const handleEditBookingModal= (record)=>{
console.log("handleEditService: ",record);

  

  const initialValues = {
    
      startDate: moment(record.startDate),
      endDate: moment(record.endDate),
      startTime: moment(record.startTime, 'HH:mm'),
      endTime: moment(record.endTime, 'HH:mm')
    
  };
  console.log("initial values: ", initialValues);
  
  
  setEditBooking(record);
  form.resetFields();
  form.setFieldsValue(initialValues);
  setisEditServiceModalVisible(true)

}

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
          {user.role === "mentor" ? (
  record.serviceType === "one-on-one" && (
    <Button type="link" onClick={() => handleRescheduleModal(record)}>
      Reschedule
    </Button>
  ) 
) : (
  <Button type="link" onClick={() => handleNewSlotModal(record)}>
    Select New Slot
  </Button>
)}

           
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


useEffect(()=>{
console.log(selectedBooking);

},[selectedBooking])
const handleNewSlotModal = (record) => {
  
  setEditBooking(record);
  fetchAvailableSlots(record);
  setIsNewSlotModalVisible(true);
 
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
            Reschedule Requests
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
            dataSource={fixedCourseFilteredBookings}
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

      <Modal
          title={"Reschedule Fixed Course details"}
          open={isEditServiceModalVisible}
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
                          name={[name, "startDate"]}
                          label="Start Date"
                          className="flex-1"
                          rules={[{ required: true, message: 'Select date' }]}
                        >
                          <DatePicker className="w-full" />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "endDate"]}
                          label="End Date"
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
                        
                      </div>
                    ))}
                   
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
              Edit service
            </Button>
          </Form>
        </Modal>



 {/* Booking Details  */}
 {selectedBooking && (
  
  
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border border-gray-200 relative">
            <div className='my-5'>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">User Details</h3>
            <p className="text-gray-700"><strong>Full name:</strong> {selectedBooking?.user?.name}</p>
            <p className="text-gray-700"><strong>Email:</strong> {selectedBooking?.user?.email}</p>
            <p className="text-gray-700"><strong>Username:</strong> {selectedBooking?.user?.username}</p>
            </div>
           
            <hr />

            <div className='my-5'>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">Service Details</h3>
            <p className="text-gray-700"><strong>Service name:</strong> {selectedBooking?.service?.serviceName}</p>
            <p className="text-gray-700"><strong>Service Type:</strong> {selectedBooking?.serviceType}</p>
            <p className="text-gray-700"><strong>Duration:</strong> {selectedBooking?.service?.duration}</p>
            <p className="text-gray-700"><strong>Description:</strong> {selectedBooking?.service?.description}</p>
            </div>
            
            <button
              onClick={() => setselectedBooking(null)}
              className="mt-4 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform w-full"
            >
              Close

             
            </button>

          </div>

          
        </div>
      )}
      </div>
      </Dashboard>
    </>
  )
}

export default Bookings