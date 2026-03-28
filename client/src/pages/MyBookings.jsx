import React, { useEffect, useState } from 'react'
import { assets, dummyMyBookingsData } from '../assets/assets';
import Title from '../components/Title';
import { UseAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function MyBookings() {
  const {axios,user,currency}=UseAppContext();
  const [bookings, setBookings]=useState([]);

  const fetchMyBooking=async()=>{
    try {
      const {data}=await axios.get('/api/booking/user')
      if(data.success){
        setBookings(data.bookings)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    user && fetchMyBooking();
  },[user]);
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>
      <Title title={'My Bookings'} subTitle={'Manage and view your Cars'} align={'left'}/>

      <div>
        {bookings.map((booking,index)=>(
          <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-lg border border-bordercolor mt-5 first:mt-12'>
            {/** car + Info */}
            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img src={booking.car.image} alt="" className='w-full h-auto aspect-video object-cover'/>
              </div>
              <p className='text-lg font-medium mt-2'>{booking.car.brand} {booking.car.model}</p>
              <p className='text-gray-500'>{booking.car.year}.{booking.car.category}.{booking.car.location}</p>
            </div>

            {/** Booking Info */}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1.5 rounded bg-light'>Booking #{index+1}</p>
                <p className={`px-3 py-1 text-sm rounded-full
                   ${booking.status==='confirmed'?'bg-green-400/15 text-green-600':'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                <div>
                  <p>Rental period</p>
                  <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                </div>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                <div>
                  <p>Pick Up Location</p>
                  <p>{booking.car.location}</p>
                </div>
              </div>


            </div>
            {/**price */}
            <div className='md:col-span-1 flex flex-col justify-between gap-6'>
              <div className='text-sm text-gray-400 text-right'>
                <p>Total Amount</p>
                <h1 className='font-semibold text-2xl text-primary'>{currency}{booking.price}</h1>
                <p>Booking On:{booking.createdAt.split('T')[0]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBookings