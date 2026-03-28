import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import CarCards from '../components/CarCards';
import {assets, dummyCarData} from '../assets/assets'
import { useSearchParams } from 'react-router-dom';
import { UseAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import {motion} from 'motion/react'

function Cars() {
  const [input , setInput]=useState('');
  //get search params from url
  const [searchParams]=useSearchParams();
  const pickUpLocation=searchParams.get('pickUpLocation')
  const pickupDate=searchParams.get('pickupDate')
  const returnDate=searchParams.get('returnDate')


  const {cars,axios}=UseAppContext();

  const isSearchData=pickUpLocation &&  pickupDate && returnDate;
  const[filteredCars,setFilteredCars]=useState([]);

  const applyFilter=async()=>{
    if (input === '') {
      setFilteredCars(cars)
    return null;
    }
    const filtered=cars.slice().filter((car)=>{
      return car.brand.toLowerCase().includes(input.toLowerCase())||
      car.model.toLowerCase().includes(input.toLowerCase())||
      car.category.toLowerCase().includes(input.toLowerCase())||
      car.transmission.toLowerCase().includes(input.toLowerCase())
    })
    setFilteredCars(filtered)
  }

  const searchAvailableCars=async()=>{
    const {data}=await axios.post('/api/booking/check-availability',{location:pickUpLocation,pickupDate,returnDate})
    if(data.success){
      setFilteredCars(data.availableCars);
      if (data.availableCars.length===0) {
        toast("No Cars Available")
      }
      return null;
    }
  }

  useEffect(()=>{
    isSearchData && searchAvailableCars()
  },[])

  useEffect(()=>{
    cars.length > 0 && !isSearchData && applyFilter()
    console.log(pickUpLocation);
    
  },[input,cars])

  return (
    <div>

      <motion.div 
      initial={{opacity:0,y:30}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.6,ease:'easeOut'}}
      className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title={'Available Cars'} subTitle={'search your needed car for your trip'}/>

        <motion.div 
        initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.6,delay:0.4}}
        className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>
          <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='search by make , model or features' className='w-full h-full outline-none text-gray-500' />
          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2'/>

        </motion.div>
      </motion.div>

      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p className='text-gray-500 lg:px-20 max-w-7xl mx-auto'>Showing {filteredCars.length} Cars</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car,index)=>(
            <motion.div 
            initial={{opacity:0,y:30}}
            whileInView={{opacity:1,y:0}}
            transition={{duration:0.6,delay:0.2}}
            key={index}>
              <CarCards car={car}/>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Cars