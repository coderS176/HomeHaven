import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';


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

app.listen(3000, ()=>{
    console.log('Server is running on port 3000!!!');
});


app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);



// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const userRouter = require('./routes/user.route.js');
// const authRouter = require('./routes/auth.route.js');

// dotenv.config();

// const uri = process.env.MONGODB_URI;

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch(err => {
//     console.error('Database connection error:', err);
//   });

// const app = express();

// app.use(express.json());

// app.listen(3000, () => {
//   console.log('Server is running on port 3000!!!');
// });

// app.use('/api/user', userRouter);
// app.use('/api/auth', authRouter);