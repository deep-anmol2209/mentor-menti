const express = require('express');
const cors = require('cors');
const config= require("./config")
const cookieParser = require('cookie-parser');

const app = express();
app.set('trust proxy', true);
require("./config/db");

const routes = require('./routes/v1');


app.use(cors({
    origin: config.CLIENT_URL
  }));


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

app.use(config.PREFIX,routes);

app.get('/', (req, res) => {
    res.send('EduHub Backend API is running.');
  });

module.exports=app;