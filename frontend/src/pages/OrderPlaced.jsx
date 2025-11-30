import React from 'react'
import { FaCircleCheck } from "react-icons/fa6"
import { useNavigate } from 'react-router-dom'

function OrderPlaced() {
    const navigate = useNavigate()
    return (
        <div className='min-h-screen bg-[#fff9f6] flex flex-col justify-center
    items-center px-4 text-center overflow-hidden'>
            <FaCircleCheck className='text-green-500 text-6xl mb-4' />
            <h1 className='text-3xl font-bold text-gray-800 mb-6'>Order Placed!</h1>
            <p>Thank You for your purchase.Your order is being prepared.
                You can track your order status in the "My Orders" section</p>
            <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white
       px-6 py-3 rounded-lg text-lg font-medium  mt-5 transition' onClick={() => navigate('/my-orders')}>
                Back to my orders
            </button>
        </div>
    )
}

export default OrderPlaced
