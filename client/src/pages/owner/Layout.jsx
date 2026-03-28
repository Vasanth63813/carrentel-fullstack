import React from 'react'
import Navbar  from '../../components/owmer/Navbar'
import Sidebar from '../../components/owmer/sidebar'
import { Outlet } from 'react-router-dom'
import { UseAppContext } from '../../context/AppContext'
import { useEffect } from 'react'

const Layout = () => {
  const {isOwner,navigate}=UseAppContext();
  useEffect(()=>{
    if (!isOwner) {
      navigate('/')
    }
  },[isOwner])
  return (
    <div className='flex flex-col'>
      <Navbar/>
      <div className='flex'>
        <Sidebar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout