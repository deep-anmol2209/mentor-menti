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
    return await AxiosInstances.get(`/booking/getBookings/${username}`)
}

export default {
    bookService,
    getMentorBookings,
    getStudentBookings,
    getBookingsByUsername
}

