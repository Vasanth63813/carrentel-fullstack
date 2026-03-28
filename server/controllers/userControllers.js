import { json } from "express";
import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Car from "../models/Car.js";

//generate jwt Token
const generateToken=(userId)=>{
    const payload=userId;
    return jwt.sign(payload,process.env.JWT_SECRET);

}

//register User
export const registerUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        if(!name || !email || !password || password.length<8){
            return res.json({success:false,message:'Fill the All Feilds'})
        }

        const Userexist= await User.findOne({email});
        if (Userexist) {
            return res.json({success:false,message:'User already exist'})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({name,email,password:hashedPassword})
        const token=generateToken(user._id.toString());
        return res.json({success:true,token})
    } catch (error) {
        console.log(error.message);
        
        return res.json({success:false,error:error.message})
    }
}

//Login User

export const loginUser=async(req,res)=>{
    try {
        const {email,password} =req.body;
        const user=await User.findOne({email})
        if (!user) {
            return res.json({success:false,message:'User not founded'})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.json({success:false,message:'invalid password'})
        }
        const token=generateToken(user._id.toString());
        return res.json({success:true,token})
    } catch (error) {
        console.log(error.message)
        return res.json({success:false,error:error.message})
    }
}

// get user data usind jwt Token

export const getUserData=async(req,res)=>{
    try {
        const {user}=req;
        res.json({success:true,user})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,error:error.message})
    }
}

// fetch cars for the Frontend

export const getCars=async(req,res)=>{
    try {
        const cars=await Car.find({isAvailable:true})
        res.json({success:true,cars})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,error:error.message})
    }
}