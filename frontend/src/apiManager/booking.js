import AxiosInstances from ".";
import axios from 'axios';


const bookService = async(data)=>{
    return await AxiosInstances.post('/booking/initiate-booking',data);
};

const getMentorBookings = async()=>{
    return await AxiosInstances.get('/booking/mentor');
};

const getStudentBookings = async()=>{
    return await AxiosInstances.get('/booking');
};

const getBookingsByUsername = async(username)=>{
    console.log(username);
    
    return await AxiosInstances.get(`/booking/getBookings/${username}`)
}

const updateBooking= async(bookingData)=>{
    console.log( bookingData);
    
    
    return await AxiosInstances.post('/booking/updateBooking', bookingData)
}

export default {
    bookService,
    getMentorBookings,
    getStudentBookings,
    getBookingsByUsername,
    updateBooking
}

