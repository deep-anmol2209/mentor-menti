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

export default {
    bookService,
    getMentorBookings,
    getStudentBookings,
}