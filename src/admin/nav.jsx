import React from 'react'
import { FaUser } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";

const nav = ({toggleSettings, toggleProductUpdate}) => {
  return (
    <div className='bg-neutral-100 w-full py-4 px-8 absolute top-0 left-0 flex items-center'>
        <div className=' border-2 p-2 rounded-full'>
            <FaUser />
        </div>
        <h1 className='font-bold ml-2'>Admin</h1>

        <div className='ml-auto p-2 rounded-full hover:text-white hover:bg-blue-400' onClick={toggleProductUpdate()}>
          <FaPlus />
        </div>

        <div className=' p-2 rounded-full hover:text-white hover:bg-blue-400' onClick={toggleSettings()}>
            <FaGear />
        </div>
      
    </div>
  )
}

export default nav
