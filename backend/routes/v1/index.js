const express = require('express');
const router = express.Router();
const homeRoute = require('./home.route');
const authRoute = require("./auth.route");
const mentorRoute= require("./mentor.route");
const userRoutes = require("./user.routes");
const serviceRoutes  = require("./service.route");
const bookingRoute = require("./booking.routes");
const paymentRoute = require('./payment.route');
const webhookRoutes= require('./webhook.routes')
const chatRoute= require("./chat.routes")

const Routes = [
    {
        path:'/',
        route:homeRoute
    },
    {
        path:'/auth',
        route:authRoute
    },
    {
        path:'/mentor',
        route:mentorRoute
    },
    {
        path:'/user',
        route:userRoutes
    },
    {
        path:'/service',
        route:serviceRoutes
    },
    {
        path:'/booking',
        route: bookingRoute
    },
    {
        path: "/payment",
        route: paymentRoute,
    },
    {
        path: "/webhook",
        route: webhookRoutes
    },
    {
        path: "/chat",
        route: chatRoute,
    },
];


Routes.forEach((route)=>{
    router.use(route.path, route.route);

});

module.exports=router;