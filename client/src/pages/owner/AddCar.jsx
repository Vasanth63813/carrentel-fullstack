import React, { useState } from 'react'
import Title from '../../components/owmer/Title'
import {assets}  from '../../assets/assets'
import { UseAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {
  const {axios,currency}=UseAppContext();
  const [image,setImage]=useState(null);
  const [car,setCar]=useState({
    brand:'',
    model:'',
    year:0,
    pricePerDay:0,
    category:'',
    transmission:'',
    fuel_type:'',
    seating_capacity:0,
    location:'',
    description:''
  })

  const [isLoading,setIsLoading]=useState(false)

  const onSubmitHandler=async(e)=>{
    e.preventDefault()
    if(isLoading) return null;

    setIsLoading(true)
    try {
      const formData=new FormData();
      formData.append('image',image);
      formData.append('carData',JSON.stringify(car))

      const {data}=await axios.post('/api/owner/add-car',formData)
      if (data.success) {
        toast.success(data.message)
        setImage(null)
        setCar({
          brand:'',
          model:'',
          year:0,
          pricePerDay:0,
          category:'',
          transmission:'',
          fuel_type:'',
          seating_capacity:0,
          location:'',
          description:''
        })
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
      <Title title={'Add new Car'} subTitle={'fill the details for add new car like seeting capacity, specification, avilability etc..'}/>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>
        {/* carImage */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor="car-image">
            <img src={image?URL.createObjectURL(image):assets.upload_icon} alt="" className='h-16 rounded cursor-pointer'/>
            <input type="file" id='car-image' accept='image/*' hidden onChange={(e)=>{setImage(e.target.files[0])}}/>
          </label>
          <p className='text-sm text-gray-500'>upload a picture of your car</p>
        </div>

        {/* carbrand&model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Brand</label>
            <input type="text" placeholder='BMV ,Tata ,Toyato etc..' required className='px-4 py-2 mt-1 border border-bordercolor 
            rounded-md outline-none' value={car.brand} onChange={e=>setCar({...car,brand:e.target.value})}/>
          </div>

          <div className='flex flex-col w-full'>
            <label>Model</label>
            <input type="text" placeholder='x3,punch,glanza etc..' required className='px-4 py-2 mt-1 border border-bordercolor 
            rounded-md outline-none' value={car.model} onChange={e=>setCar({...car,model:e.target.value})}/>
          </div>

        </div>

        {/* caryaer,price,category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Year</label>
            <input type="number" placeholder='2025' required className='px-4 py-2 mt-1 border border-bordercolor 
            rounded-md outline-none' value={car.year} onChange={e=>setCar({...car,year:e.target.value})}/>
          </div>

          <div className='flex flex-col w-full'>
            <label>Daily Price{(currency)}</label>
            <input type="number" placeholder='120' required className='px-4 py-2 mt-1 border border-bordercolor 
            rounded-md outline-none' value={car.pricePerDay} onChange={e=>setCar({...car,pricePerDay:e.target.value})}/>
          </div>

          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select name="" id="" onChange={e=>setCar({...car,category:e.target.value})} value={car.category} 
              className='px-3 py-2 mt-2 border border-bordercolor rounded-md outline-none'>
              <option value="">select a category</option>
              <option value="sedan">sedan</option>
              <option value="SUV">SUV</option>
              <option value="van">Van</option>
            </select>
          </div>
        </div>

        {/* carTransmision,fuel_type,seating_capacity */}

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6'>

          <div className='flex flex-col w-full'>
            <label>Transmision</label>
            <select name="" id="" onChange={e=>setCar({...car,transmission:e.target.value})} value={car.transmission} 
              className='px-3 py-2 mt-2 border border-bordercolor rounded-md outline-none'>
              <option value="">select a Transmision</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>

          <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select name="" id="" onChange={e=>setCar({...car,fuel_type:e.target.value})} value={car.fuel_type} 
              className='px-3 py-2 mt-2 border border-bordercolor rounded-md outline-none'>
              <option value="">select a fuel type</option>
              <option value="Gas">Gas</option>
              <option value="Petrol">Petrol</option>
              <option value="Deisel">Deisel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              </select>
          </div>

          <div className='flex flex-col w-full'>
            <label>Seat Capacity</label>
            <input type="number" placeholder='4' required className='px-4 py-2 mt-1 border border-bordercolor 
            rounded-md outline-none' value={car.seating_capacity} onChange={e=>setCar({...car,seating_capacity:e.target.value})}/>
          </div>

        </div>

        {/* carlocation */}

        <div className='flex flex-col w-full'>
          <label>Location</label>
            <select name="" id="" onChange={e=>setCar({...car,location:e.target.value})} value={car.location} 
              className='px-3 py-2 mt-2 border border-bordercolor rounded-md outline-none'>
              <option value="">select a Location</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Houston">Houston</option>
              <option value="Chicago">Chicago</option>
            </select>
        </div>

        {/* cardiscription */}
        <div className='flex flex-col w-full'>
            <label>Discription</label>
            <textarea rows={5} placeholder='discription' required className='px-4 py-2 mt-1 border border-bordercolor 
            rounded-md outline-none' value={car.description} onChange={e=>setCar({...car,description:e.target.value})}/>
        </div>

        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary
         text-white  rounded-md  font-medium max-w-40  cursor-pointer'>
          <img src={assets.tick_icon} alt="" />
          {isLoading?"Listing....":'List your Cars'}
        </button>

      </form>
    </div>
  )
}

export default AddCar