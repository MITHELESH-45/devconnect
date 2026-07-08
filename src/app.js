require('dotenv').config();
const express = require('express');
const connectDb = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const cors = require('cors');
const http = require('http');
const intializeSocket = require('./utils/socket');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
      origin: process.env.FRONTEND_URL,
      credentials: true
}));





app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

const server = http.createServer(app);
intializeSocket(server);

connectDb().then(() => {
      console.log("Database connected successfully");

      server.listen(process.env.PORT || 3000, () => {
            console.log("Server is running on port " + (process.env.PORT || 3000));
      });
}).catch((error) => {
      console.error("Database connection failed:", error);
});





