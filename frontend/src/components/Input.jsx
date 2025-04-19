import React, { useState } from 'react'

const Input = ( { name, placeholder , type , id , value , icon }) => {
  
  const [ passwordVisible, setpasswordVisible ] = useState(false)
  
  return (
    <div className="relative w-full mb-4">
  <i className={`${icon} absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg pointer-events-none`}></i>

  <input
    name={name}
    type={type === "password" ? passwordVisible ? "text" : "password" : type}

    placeholder={placeholder}
    id={id}
    defaultValue={value}
    className="w-full pl-10 pr-3 p-3 bg-zinc-200 rounded-lg outline-none focus:ring-1 focus:ring-purple-500"
  />
 
 {
  type == 'password' ? 
  <i className="ri-eye-close-fill
  absolute left-70 top-1/2 transform -translate-y-1/2
   text-gray-500 text-lg
  "
  onClick={()=>setpasswordVisible(!passwordVisible)}
  ></i>
  : ""
 }

</div>

  )
}

export default Input