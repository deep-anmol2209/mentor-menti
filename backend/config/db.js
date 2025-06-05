const mongoose = require('mongoose');
const config = require('.'); 
mongoose.set('strictQuery', true); 


mongoose.connect(config.DB_URL)
.then(()=>console.log('database is connected'))
.catch((err)=>{
    console.log('Database connection is not established');
    console.log(err);
}) // connect then catch will execute only one time, but connection.on will continously monitor the connection and handle the issue in connection, this provide better debugging


mongoose.connection.on('connected',()=>{
    console.log('Mongoose default connection open');
});

mongoose.connection.on('error',(error)=>{
    console.log('Mongoose default connection has an error ' + error);
});

mongoose.connection.on('disconnected',()=>{
    console.log('Mongoose Disconnected');
});

process.on('SIGINT',()=>{
    process.exit(0);
}) // CleanUp Process - to close established connection beacuse if not closed it will use memory and prevent memory leakage || SIGINT - we are sending signal that user manually closing the connection

module.exports = mongoose.connection;