import React, { useState } from 'react'
import { Navbar } from './components/Navbar'
import{ BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home'
import Footer from './components/Footer';
import { CarDetails } from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';
import Layout from '../src/pages/owner/Layout'
import Dashboard from '../src/pages/owner/Dashboard'
import AddCar from '../src/pages/owner/AddCar'
import ManageCar from '../src/pages/owner/ManageCar'
import ManageBookings from '../src/pages/owner/ManageBookings'
import Login from './components/Login';
import {Toaster} from 'react-hot-toast'
import { UseAppContext } from './context/appContext';



function App() {
  const {showLogin}=UseAppContext();
  const isOwenerPath=useLocation().pathname.startsWith('/owner')
  return (
    <>
     <Toaster/>
      {showLogin && <Login />}
      {!isOwenerPath && <Navbar />}

      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/car-details/:id' element={<CarDetails/>}></Route>
        <Route path='/cars' element={<Cars/>}></Route>
        <Route path='/my-bookings' element={<MyBookings/>}></Route>
        <Route path='/owner' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='add-car' element={<AddCar/>}/>
          <Route path='manage-cars' element={<ManageCar/>}/>
          <Route path='manage-bookings' element={<ManageBookings/>}/>

        </Route>
      </Routes>

      {!isOwenerPath && <Footer/>}
      
    </>
  )
}

export default App