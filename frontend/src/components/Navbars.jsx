import React, { useState } from 'react'
import logo from '../imgs/logo.png';
import { Link ,Outlet } from 'react-router'

const Navbars = () => {
  const [isopen , setIsopen] = useState(false);

  return (
    <>
    <div className='flex items-center justify-around h-16 w-full '>
      {/* Image and input */}
      <div className='flex items-center justify-center gap-2'>
        <Link to='/'>
          <img src={logo} className='h-8 w-10 ' alt="" />
        </Link>

        <div className="relative w-full md:max-w-md">
          <i 
          onClick={() => setIsopen(!isopen)}
          className="ri-search-line absolute left-4 
          top-1/2 -translate-y-1/2 text-gray-500 text-md"></i>

          <input
            type="text"
            placeholder="Search"
            className={` ${isopen ? 'w-40' : ''}  bg-zinc-300 placeholder-transparent p-2 pl-10 w-1 rounded-full md:w-40 text-sm
            md:rounded-3xl md:placeholder-gray-500 outline-none transition-all duration-300`}
          />
        </div>

      </div>

      <div className="buttons items-center flex gap-2">

        <div className='text-lg md:text-xl md:mr-4'>
          {/* Write Icons */}
          <Link to='/editor' >
          <i className="ri-file-edit-fill"></i>
          </Link>
          
        </div>

        <Link to='/signin' className="p-2 rounded-full pl-4 pr-4 text-sm font-[arial] bg-black text-white">
          Sign in
        </Link>

        <Link to='/signup' className="hidden md:block p-2 rounded-full pl-4 pr-4 text-sm font-[arial] bg-zinc-300 text-black">
          Sign up
        </Link>
      </div>


    </div>
    <Outlet/>
    </>
    
    
  )
  
}

export default Navbars;