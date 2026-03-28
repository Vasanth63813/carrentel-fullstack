import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { UseAppContext } from '../context/AppContext';
import {motion} from 'motion/react'

export const Hero = () => {
  const [pickUpLocation,setPickUpLocation]=useState(null);
  const {pickupDate,setPickupDate,returnDate,setReturnDate,navigate}=UseAppContext();

  const handleSearch=(e)=>{
    e.preventDefault();
    navigate(`/cars?pickUpLocation=${pickUpLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`)
  }
  return (
    <motion.div 
    initial={{opacity:0}}
    animate={{opacity:1}}
    transition={{duration:0.8}}
     className='h-screen flex flex-col items-center justify-center gap-14 text-center bg-light'>
        <motion.h1 initial={{y:50,opacity:0}}
        animate={{y:0,opacity:1}}
        transition={{duration:0.8,delay:0.2}}  className='text-4xl md:text-5xl font-semibold'>Luxory Cars On Rent</motion.h1>
        <motion.form 
        initial={{scale:0.95,opacity:0,y:50}}
        animate={{scale:1,opacity:1,y:0}}
        transition={{duration:0.6,delay:0.4}}
        onSubmit={handleSearch} className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 w-full
         max-w-80 md:max-w-200 bg-white rounded-lg md:rounded-full shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>
           <div className='flex flex-col md:flex-row items-startn md:items-center gap-10 md:ml-8'>
              <div>
                 <select required value={pickUpLocation} onChange={(e)=>setPickUpLocation(e.target.value)}>
                  <option value="">pick Up Location</option>
                   {cityList.map((city)=><option key={city} value={city}>{city}</option>)}
                 </select>
                 <p className='px-1 text-sm text-gray-500'>{pickUpLocation?pickUpLocation:'please select location'}</p>
              </div>
              <div className='flex flex-col items-start gap-2'>
                <label htmlFor="pickup-date">Pick Up Date</label>
                <input value={pickupDate} onChange={e=>setPickupDate(e.target.value)} type="date"  id="pickup-date" required className='text-sm text-gray-400 ' min={new Date().toISOString().split('T')[0]}/>
              </div>
              <div className='flex flex-col items-start gap-2'>
                <label htmlFor="return-date">Return Date</label>
                <input value={returnDate} onChange={e=>setReturnDate(e.target.value)} type="date"  id="return-date" required className='text-sm text-gray-400 '/>
              </div>
            </div>
              <motion.button whileHover={{scale:1.05}}
              whileTap={{scale:0.95}}
               className='flex flex-row bg-primary hover:bg-primary-dull sm:mt-4 
               rounded-full  items-center justify-center text-white gap-2 px-9 py-3 cursor-pointer'>
                <img src={assets.search_icon} alt="search" className='brightness-300' />
                Search
              </motion.button>
         </motion.form>
        <motion.img 
        initial={{y:100,opacity:0}}
        animate={{y:0,opacity:1}}
        transition={{duration:0.8,delay:0.6}}
        src={assets.main_car} alt="car" className='max-h-72'/>
    </motion.div>
  )
}
