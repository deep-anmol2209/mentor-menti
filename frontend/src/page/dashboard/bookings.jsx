import React, { useEffect, useState } from 'react';
import {Table,Button,Spin} from 'antd';
import Dashboard from './dashboard';
import booking from '../../apiManager/booking';

const Bookings = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' or 'past'

  const fetchBookings = async () => {
    setLoading(true);
    const res = await booking.getMentorBookings();
    setBookings(res?.data?.bookings);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "upcoming") {
      return moment(booking.dateAndTime).isAfter(moment()); // Future bookings
    } else {
      return moment(booking.dateAndTime).isBefore(moment()); // Past bookings
    }
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "dateAndTime",
      key: "date",
      render: (text) => moment(text).format("DD MMM YYYY"), // Render only date
    },
    {
      title: "Time",
      dataIndex: "dateAndTime",
      key: "time",
      render: (text) => moment(text).format("hh:mm A"), // Render only time
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`${
            status === "pending" ? "text-red-500" : "text-green-500"
          } font-semibold`}
        >
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

      </div>
      </Dashboard>
    </>
  )
}

export default Bookings