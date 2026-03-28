import Booking from "../models/Booking.js"
import Car from "../models/Car.js"
import User from "../models/user.js"


//check available for car on pickup date and return date
export const checkAvailability=async(car,pickupDate,returnDate)=>{
    const booking=await Booking.find({
        car,
        pickupDate:{$lte:returnDate},
        returnDate:{$gte:pickupDate}
    })
    return booking.length===0;
}

//check availability of car on given Date and Location
export const checkAvailabilityofCar=async(req,res)=>{
    try {
        const{location,pickupDate,returnDate}=req.body;
        //fetch all car available in the location 
        const cars =await Car.find({location,isAvailable:true})
        //check car available using Promise
        const checkAvailabilityPromise=cars.map(async(car)=>{
            const isAvailable=await checkAvailability(car._id,pickupDate,returnDate)
            return {...car._doc,isAvailable:isAvailable}
        })
        let availableCars=await Promise.all(checkAvailabilityPromise);
        availableCars=availableCars.filter(car=>car.isAvailable===true)

        res.json({success:true,availableCars})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//API to create Bookings

export const createBooking=async(req,res)=>{
    try {
        const {_id}=req.user;
        const{car,pickupDate,returnDate}=req.body;

        const isAvailable=await checkAvailability(car,pickupDate,returnDate)
        if (!isAvailable) {
            return res.json({success:false,message:"Car Not available"})
        }

        const carData=await Car.findById(car)

        //calculate price for the car
        const pickup=new Date(pickupDate);
        const returned=new Date(returnDate);
        const noOfDays=Math.ceil((returned-pickup)/(1000*60*60*24));
        const price=carData.pricePerDay*noOfDays;
        await Booking.create({car,owner:carData.owner,user:_id,pickupDate,returnDate,price})
        res.json({success:true,message:"Booking Created"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//api to list user bookings

export const getUserBookings=async(req,res)=>{
    try {
        const {_id}=req.user;
        const bookings=await Booking.find({user:_id}).populate("car").sort({createdAt:-1})
        res.json({success:true,bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//api to get owner bookings

export const getOwnerBookings=async(req,res)=>{
    try {
        if(req.user.role!="owner"){
            return res.json({success:false,message:"unauthorized"})
        }
        const bookings=await Booking.find({owner:req.user._id}).populate("car").populate("user","-password").sort({createdAt:-1});
        res.json({success:true,bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//api to changing booking status

export const changeBookingStatus=async(req,res)=>{
    try {
        const {_id}=req.user;
        const{bookingId,status}=req.body;
        const booking=await Booking.findById(bookingId)
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        //const booking=await Booking.findById(bookingId)
        booking.status=status;
        await booking.save()
        res.json({success:true,message:"status updated"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}