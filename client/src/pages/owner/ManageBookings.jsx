import React, { useEffect, useState } from 'react'
import {assets} from '../../assets/assets'
import Title from '../../components/owmer/Title'
import { UseAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {
  const {axios,currency}=UseAppContext();

  const [bookings,setBookings]=useState([]);
  
    const fetchBookingsCars=async()=>{
      try {
        const {data}=await axios.get('api/booking/owner');
        data.success ? setBookings(data.bookings):toast.error(data.message)
      } catch (error) {
        toast.error(error.message)
      }
    }

    const changeBookingStatus=async(bookingId,status)=>{
      try {
        const {data}=await axios.post('api/booking/change-status',{bookingId,status});
        if (data.success) {
          toast.success(data.message)
          fetchBookingsCars();
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  
    useEffect(()=>{
      fetchBookingsCars();
    },[])
  return (
      <div className='px-4 pt-10 md:px-10 w-full'>
       <Title title={"Mansge Bookings"} subTitle={"Track all Booking Cars and manage Booking status "}/>

       <div className='max-w-3xl w-full rounded-md overflow-hidden border border-bordercolor mt-6'>

          <table className='w-full border-collapse text-left text-sm text-gray-600'>
            <thead className='text-gray-500'>
               <tr>
                <th className='p-3 font-medium'>Car</th>
                <th className='p-3 font-medium max-md:hidden'>Date Range</th>
                <th className='p-3 font-medium'>Total</th>
                <th className='p-3 font-medium max-md:hidden'>Payment</th>
                <th className='p-3 font-medium'>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking,index)=>(
                <tr key={index} className='border-t border-bordercolor'>
                  <td className='p-3 flex items-center gap-3'>
                      <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                      <div className='max-md:hidden'>
                        <p className='font-medium'>{booking.car.brand} {booking.car.model}</p>
                      </div>
                  </td>

                  <td className='p-3 max-md:hidden'>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</td>
                  <td className='p-3 '>{currency}{booking.price}</td>

                  <td className='p-3 max-md:hidden'>
                     <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>
                      offline
                     </span>
                  </td>

                  <td className='p-3'>
                    {booking.status==='pending'?(
                      <select onChange={e=>changeBookingStatus(booking._id,e.target.value)} value={booking.status} className='px-2 py-1.5 mt-1 text-gray-500 rounded-md border border-bordercolor outline-none'>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ):(
                      <span className={`px-3 py-1 rounded-full font-semibold ${booking.status==='confirmed'?'bg-green-100 text-green-500'
                        :'bg-red-100 text-red-500'
                      }`}>{booking.status}</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
       </div>

    </div>
  )
}

export default ManageBookings