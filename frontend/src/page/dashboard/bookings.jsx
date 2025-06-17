import React, { useEffect, useState } from 'react';
import {Table,Button,  Input, Modal, Form, Spin, Select, DatePicker, TimePicker} from 'antd';
import Dashboard from './dashboard';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' or 'past'
  const [editBooking, setEditBooking]= useState()

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
  
    setIsModalVisible(false);
  }, []);
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "upcoming") {
      return booking.status=== 'confirmed' || booking.status=== 'pending'; // Future bookings
    } else if (activeTab === "completed"){
      return booking.status=== "completed"; // Past bookings
    }
    else{
      return booking.status=== "rescheduled" || "reschedulerequest"
    }
  });
console.log(filteredBookings);

const formatFormValues = useCallback((values) => {
  console.log(values);
  
  const formattedValues = { ...values };
  
console.log(formattedValues);


    // Format availability for one-on-one
    if (formattedValues.availability) {
      formattedValues.availability = formattedValues.availability
        .filter(slot => slot.date && slot.startTime && slot.endTime)
        .map(slot => ({
          date: slot.date.format("YYYY-MM-DD"),
          timeSlots: [{
            startTime: slot.startTime.format("HH:mm"),
            endTime: slot.endTime.format("HH:mm")
          }]
        }));
    }
  
  return formattedValues;
}, [bookings]);


const handleRecheduleSubmit = useCallback(async (values) => {
  setLoading(true);
  try {
    const formattedValues = formatFormValues(values);
    
    if (!formattedValues.availability || formattedValues.availability.length === 0) {
      throw new Error("Please add at least one availability slot for one-on-one courses");
    }

    if (!editBooking || !editBooking._id) {
      toast.error("Booking information is missing");
      return;
    }

    const bookingData = {
      ...editBooking, 
      rescheduleSlots: formattedValues.availability, 
      status: "reschedulerequest", 
      rescheduleRequested: true
    };
  
    const response = await booking.updateBooking(bookingData);
    console.log(response);
     
    toast.success("Reschedule request sent successfully!");
    setIsModalVisible(false);
    fetchBookings(); // Refresh the bookings list
  } catch (error) {
    console.error(`Error rescheduling booking: `, error);
    toast.error(error.message || `Failed to reschedule. Please try again.`);
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

// 🟧 Add this only if mentor
if (user.role === 'mentor') {
  columns.push({
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <div className="flex gap-2">
        <Button
          type="link"
          onClick={() => handleOpenModal(record)}
        >
          Reschedule
        </Button>
        <Button
          type="link"
          danger
          onClick={() => handleCancelBooking(record)}
        >
          Cancel
        </Button>
      </div>
    )
  });
}

const handleOpenModal = (record) => {
  console.log(record);
  // Convert the booking data to match the form structure
  const initialValues = {
    availability: [{
      date: moment(record.bookingDate),
      startTime: moment(record.startTime, 'HH:mm'),
      endTime: moment(record.endTime, 'HH:mm')
    }]
  };
  
  setEditBooking(record);
  form.resetFields();
  form.setFieldsValue(initialValues); // Set initial form values
  setIsModalVisible(true);
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
          open={isModalVisible}
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

      </div>
      </Dashboard>
    </>
  )
}

export default Bookings