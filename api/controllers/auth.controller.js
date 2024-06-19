import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup  = async (req, res) =>{
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});

    // if we try to enter the same mail again because we have declared that the email should be unique
    // then it should be showing internal error in insomnia
    
    try{
        await newUser.save();
        res.status(201).json('User created successfully');
    }
    // tracking the error 
    catch(error){
        res.status(500).json(error.message);
    }
    
}; 