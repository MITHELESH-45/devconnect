const express=require('express');
const connectDb=require('./config/database');
const User=require('./models/user');
const bcrypt=require('bcrypt');
const {validateSignUpData,validateEmail}=require('./utils/validate');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const UserAuth=require('./middlewares/auth');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');



const app=express();
app.use(express.json());
app.use(cookieParser());


app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);

connectDb().then(()=>{
      console.log("Database connected successfully");
      app.listen(3000,()=>{
          console.log("Server is running on port 3000");
      });
}).catch((error)=>{
      console.error("Database connection failed:", error);
});





