import axios from 'axios'
import React, { use } from 'react'
import { data, useParams } from 'react-router-dom'
import { serverUrl } from '../App.jsx'
import { useEffect } from 'react'
import { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io"
import { useNavigate } from 'react-router-dom'
import DeliveryBoyTrackinig from '../components/DeliveryBoyTrackinig'
function TrackOrderPage() {
    const {orderId}=useParams()
    const navigate= useNavigate()
    const[currentOrder,setCurrentOrder]=useState()
    const handleGetOrder=async()=>{
        try {
            const result= await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`,{withCredentials:true})
          setCurrentOrder(result.data)
        } catch (error) {
            console.log("get order by id error:",error)
        }
    }
    useEffect(()=>{
        handleGetOrder()
    },[orderId])
  return (
    <div className='max-w-4xl mx-auto p-4 flex flex-col gap-6'>
       <div className='relative flex items-center top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer' onClick={()=>navigate("/")}>
                  <IoIosArrowRoundBack size={30} className='text-[#ff4d2d]'  />
                <h1 className='text-2xl font-bold md:text-center'>Track Order</h1>
              </div>
              {currentOrder?.shopOrders?.map((shopOrder,index)=>(
                <div className='bg-white p-4 rounded-2xl shadow-md border-orange-100 space-y-4' key={index}>
                    <div>
                        <p className='text-lg font-bold mb-2 text-[#ff4d2d]'>{shopOrder.shop.name}</p>
                        <p className='font-semibold'><span>Items:</span>{shopOrder.shopOrderItems?.map(i=>i.name).join(",")}</p>
                        <p className='font-semibold'><span>Subtotal:</span>₹{shopOrder.subTotal}</p>
                        <p><span>Delivery Address:</span>{currentOrder.deliveryAddress?.text}</p>
                    
                    </div>
                    {shopOrder.status!=="delivered"?<>
                   
                    {shopOrder.assignedDeliveryBoy?<div className='text-sm text-gray-700'>
                       <p className='font-semibold'><span>Delivery Boy Name:</span>{shopOrder.assignedDeliveryBoy.fullName}</p>
                       <p className='font-semibold'><span>Delivery Boy Contact Number:</span>{shopOrder.assignedDeliveryBoy.mobileNumber}</p>
                    </div>:<p>Delivery Boy is not assigned yet</p>}

                    </>:<p className='text-green-600 font-semibold text-lg'>Delivered</p>}
                 {(shopOrder.assignedDeliveryBoy && shopOrder.status!=="delivered") &&
                 <div className='h-[400px] w-full rounded-2xl overflow-hidden shadow-md'>
                 <DeliveryBoyTrackinig data={{
                    deliveryBoyLocation:{latitude:shopOrder.assignedDeliveryBoy.location.coordinates[1],
                        longitude:shopOrder.assignedDeliveryBoy.location.coordinates[0]
                    },
                    customerLocation:{
                        latitude:currentOrder.deliveryAddress.latitude,
                        longitude:currentOrder.deliveryAddress.longitude
                    }
                 }
                   
                 }/></div>}
                </div>
              ))}
    </div>
  )
}

export default TrackOrderPage
