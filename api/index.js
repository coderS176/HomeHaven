import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config();

const uri = process.env.MONGO;

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

const app = express();

// allowing json as input
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.listen(3000, ()=>{
    console.log('Server is running on port 3000!!!');
});


app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

// this is a middleware
// it provies a more comprehnesive error message when any error occur
// like inserting duplicate 
app.use((err, req, res, next) => {
  const statusCode = err.statusCode ||500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
})



