import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO;

console.log('MONGODb_URI', uri);
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Database connection successful');
})
.catch(err => {
    console.error('Database connection error:', err);
});

const app = express();

app.listen(3000, ()=>{
    console.log('Server is running on port 3000!!!');
});