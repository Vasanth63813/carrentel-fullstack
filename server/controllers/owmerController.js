import User from "../models/user.js";
import Car from "../models/Car.js"
import Booking from "../models/Booking.js"
import imagekit from "../configs/imagekit.js";
import fs from "fs"
import { log } from "console";

export const changeRoleToOwner=async(req,res)=>{
    try {
        const {_id}=req.user;
        await User.findByIdAndUpdate(_id,{role:"owner"})
        res.json({success:true,message:"Now you can List your car"})
    } catch (error) {
        res.json({success:false,error:error.message})
    }
}

//API to add Cars

export const addCar=async(req,res)=>{
    try {
        const {_id}=req.user;
        let car =JSON.parse(req.body.carData);
        const imageFile=req.file;
        console.log("KKKKKK");
        

        if(!imageFile){
            return res.json({success:false,message:"img not upload"})
        }
        

        //upload images
        const fileBuffer=fs.readFileSync(imageFile.path);
        const response= await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:'/cars'
        })

        //optimize through imagekit URL transformation
        var optimizedImageUrl=imagekit.url({
            path:response.filePath,
            transformation:[
                {width:'1280'},//width resize
                {quality:'auto'},//auto comparsion
                {format:'webp'}//convert to modern format
            ]
        })
        const image=optimizedImageUrl;
        await Car.create({...car,owner:_id,image})
        res.json({success:true,message:"Car Added"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,error:error.message})
    }
}

//api to list OwnerCars

export const getOwnerCars=async(req,res)=>{
    try {
        const {_id}=req.user;
        const car=await Car.find({owner:_id})
        res.json({success:true,car})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to toggle car availability
export const toggleAvailability=async(req,res)=>{
    try {
        const {_id}=req.user;
        const {carId}=req.body;
        const car= await Car.findById(carId)
        //check car belongs to owner
        if (car.owner.toString() != _id.toString()) {
            return res.json({success:false,message:"Unauthorized"})
        }
        car.isAvailable=!car.isAvailable
        await car.save()
        res.json({success:true,message:"Car Available"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//delete a car
export const deleteCar=async(req,res)=>{
    try {
        const {_id}=req.user;
        const {carId}=req.body;
        const car= await Car.findById(carId)
        if (!car) {
            return res.status(404).json({
            success: false,
            message: "Car not found"
        });
}
        //check car belongs to owner
        if (car.owner.toString()!=_id.toString()) {
            return res.json({success:false,message:"Unauthorized"})
        }
        car.owner=null;
        car.isAvailable=false;
        await car.save()
        res.json({success:true,message:"Car Deleted"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get Dashboard Data
export const getDashboardData=async(req,res)=>{
    try {
        const{_id,role}=req.user;
        if (role!="owner") {
            return res.json({success:false,message:"Unauthorized"})
        }
        const cars=await Car.find({owner:_id})
        const bookings=await Booking.find({owner:_id}).populate('car').sort({createdAt:-1});

        const pendingBookings=await Booking.find({owner:_id,status:"pending"})
        const confirmedBookings=await Booking.find({owner:_id,status:"confirmed"})

        //calculate monthlyrevenue from booking status booking ===confirmed
        const monthlyRevenue=bookings.slice().filter(booking=>booking.status==="confirmed")
        .reduce((acc,booking)=>acc+booking.price,0)

        const Dashboard={
            totalCars:cars.length,
            totalBookings:bookings.length,
            pendingBookings:pendingBookings.length,
            confirmedBookings:confirmedBookings.length,
            recentBookings:bookings.slice(0,3),
            monthlyRevenue
        }
        res.json({success:true,Dashboard})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to update image
export const updateUserImage=async(req,res)=>{
    try {
        const {_id}=req.user;
        const imageFile=req.file;
        

        //upload images
        const fileBuffer=fs.readFileSync(imageFile.path);
        const response= await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:'/users'
        })

        //optimize through imagekit URL transformation
        var optimizedImageUrl=imagekit.url({
            path:response.filePath,
            transformation:[
                {width:'400'},//width resize
                {quality:'auto'},//auto comparsion
                {format:'webp'}//convert to modern format
            ]
        })
        const image=optimizedImageUrl;
        await User.findByIdAndUpdate(_id,{image});
        res.json({success:true,message:"Image Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}