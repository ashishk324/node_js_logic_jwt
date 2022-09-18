const express = use('express');
const app = express();
var userRouter = require('./user/userController');
var authController = require('./auth/authController')

app.use('/users',userRouter);
app.use('/auth',authController);

module.exports = app;