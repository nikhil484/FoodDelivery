import React from 'react'
import { MdPhone } from "react-icons/md"
import { IoLocationOutline } from "react-icons/io5"

function OwnerOrderCard({data}) {
  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-4'>
        <div>
        <h2 className='text-lg font-semibold text-gray-800'>{data.user.fullName}</h2>
        <p className='text-sm text-gray-500'>{data.user.email}</p>
        <p className='flex items-center gap-2 text-sm text-gray-600 mt-1'><MdPhone /><span>{data.user.mobileNumber}</span></p>
        </div>

        <div className='flex items-start flex-col gap-2 text-gray-600 text-sm'>
            <p className='flex items-center '> <IoLocationOutline className='text-[#007AFF]'/><span>{data?.deliveryAddress?.text}</span></p>
            <p className='text-xs'>lat:{data?.deliveryAddress.latitude},lon:{data?.deliveryAddress.longitude}</p>
            
      </div>
    </div>
  )
}

export default OwnerOrderCard
