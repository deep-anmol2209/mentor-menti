import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Spin } from "antd";
import { AiOutlineDollarCircle } from "react-icons/ai";

import paymentApi from "@/apiManager/payment";
// import Dashboard from "./dashboard"; // Assuming the Dashboard layout is used for consistent structure
import { MdOutlineCurrencyRupee } from "react-icons/md";
import * as XLSX from "xlsx"; // Import xlsx library

const Payment = () => {

    const [payments, setPayments] = useState([]);
    const [userDetails, setUserDetails]= useState([]);
    const [loading, setLoading] = useState(true);
    const [serviceDetails, setServiceDetails]= useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
          try {
            setLoading(true)
            const pay = await paymentApi.getMentorPayments();
            if (pay && Array.isArray(pay.payments)) {
              setPayments(pay.payments);
            }
            
          } catch (error) {
            console.error("Error fetching payments:", error);
          }finally{
            setLoading(false)
          }
        };
      
        fetchPayments();
      }, []);
      
      

    const [searchTerm, setSearchTerm] = useState("");
console.log(userDetails);

const tableData = payments.map((payment, index) => ({
    key: index + 1,
    no: index + 1,
    studentName: payment.booking?.user?.name || "Unknown",
    transactionId: payment.transactionId,
    date: new Date(payment.createdAt).toLocaleDateString(),
    amount: `₹${payment.booking.service.price}`|| "",
    status: (payment.booking.status==="rescheduled" || payment.booking.status==="confirmed") && "Completed" ,
  }));
  
  const filteredData = tableData.filter(item =>
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );
   
  

    const columns = [
        {
            title: "No.",
            dataIndex: "no",
            key: "no",
            sorter: (a, b) => a.no - b.no,
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "Student Name",
            dataIndex: "studentName",
            key: "studentName",
            sorter: (a, b) => a.studentName.localeCompare(b.studentName),
        },
        {
            title: "Transaction ID",
            dataIndex: "transactionId",
            key: "transactionId",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (text) => (
                <span className="text-lg font-semibold text-orange-600">{text}</span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <span
                    className={`status ${status === "Completed" ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {status}
                </span>
            ),
        },
    ];

    // Function to handle export to Excel
    const exportToExcel = () => {
        // Prepare the data in the format needed for export
        const exportData = filteredData.map((item) => ({
            "No.": item.no,
            "Student Name": item.studentName,
            "Transaction ID": item.transactionId,
            "Date": item.date,
            "Amount": item.amount,
            "Status": item.status,
        }));

        // Create a new workbook
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Payment History");

        // Generate Excel file and prompt the user to download
        XLSX.writeFile(wb, "Payment_History.xlsx");
    };

    return (
       <>
            <div className="p-6 bg-white rounded-lg shadow-lg lg:mt-20">
                <div className="flex items-center mb-4">
                    <MdOutlineCurrencyRupee className="mr-2 text-3xl text-orange-500" />
                    <h2 className="text-2xl font-bold text-orange-600">Payment History</h2>
                </div>

                {/* Search bar for filtering */}
                <div className="mb-4">
                    <Space>
                        <Input
                            placeholder="Search by Student Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            allowClear
                            className="w-64"
                        />
                    </Space>
                </div>

                {/* Table Component */}
                {loading? (<div className="flex justify-center my-6">
              <Spin size="large" />
            </div>):(
                <div className="w-full overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{
                        pageSize: 3, // Number of rows per page
                        showSizeChanger: true, // Allows the user to change page size
                        pageSizeOptions: ["3", "5", "10"], // Options for page size
                    }}
                    className="w-full"
                    rowClassName="hover:bg-orange-100 transition-all"
                    bordered
                    size="small"
                />
                </div>
            )}
                

                {/* Export Button */}
                <div className="mt-4">
                    <Button
                        type="primary"
                        icon={<AiOutlineDollarCircle />}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={exportToExcel} // Call the export function on click
                    >
                        Export Payment History
                    </Button>
                </div>
            </div>
       </>
    );
};

export default Payment;
