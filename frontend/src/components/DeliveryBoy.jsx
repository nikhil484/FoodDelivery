import React from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App.jsx';
import { useEffect } from 'react';
import { useState } from 'react';
import DeliveryBoyTrackinig from './DeliveryBoyTrackinig.jsx';
function DeliveryBoy() {
  const { userData } = useSelector(state => state.user)
  const [deliverytask, setDeliverytask] = useState(null)
  const [riderOrder, setRiderOrder] = useState(null)
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otp, setOtp] = useState("")

  const getDeliveryTask = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-deliverytask`, { withCredentials: true })
      console.log(result.data)
      setDeliverytask(result.data)
    } catch (error) {
      console.log("get delivery task error:", error)
    }
  }

  const getRiderOrders = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-riderOrders`, { withCredentials: true })
      setRiderOrder(result.data)

    } catch (error) {
      console.log("get rider order:", error)
    }
  }




  const acceptOrder = async (deliveryTaskId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/accept-DeliveryTask/${deliveryTaskId}`, { withCredentials: true })
      console.log(result.data)
      await getRiderOrders()
    } catch (error) {
      console.log("accept delivery task error:", error)
    }
  }




  const sendOtp = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/send-delivery-otp`,
        { orderId: riderOrder.orderId, shopOrderId: riderOrder.shopOrder._id }, { withCredentials: true})
      console.log(result.data)
      setShowOtpBox(true)
    } catch (error) {
      console.log(error)
    }
  }

  // const verifyOtp = async () => {

  //   try {
  //     const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`,
  //       { orderId: riderOrder.orderId, shopOrderId: riderOrder.shopOrder._id, otp }, { withCredentials: true })

  //     console.log(result.data)

  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const verifyOtp = async () => {
  try {
    const result = await axios.post(
      `${serverUrl}/api/order/verify-delivery-otp`,
      { 
        orderId: riderOrder.orderId,
        shopOrderId: riderOrder.shopOrder._id,
        otp 
      },
      { withCredentials: true }
    );

    console.log("Delivery Completed:", result.data);

  
    setRiderOrder(null);
    setShowOtpBox(false);
    setOtp("");
    await getDeliveryTask();
    alert("Delivery Completed!");

  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    getDeliveryTask()
    getRiderOrders()

  }, [userData])
  return (

    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <div className='w-full max-w-[800px] flex flex-col gap-2 items-center'>
        <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2'>
          <h1 className='text-xl font-bold text-[#ff4d2d]'>Welcome,{userData.fullName}</h1>
          <p className='text-gray-600'><span className='font-semibold'>Latitude:</span>{userData.location.coordinates[1]},<span className='font-semibold'> Longitude:</span>{userData.location.coordinates[0]}</p>
        </div>
        {!riderOrder &&
          <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
            <h1 className='text-lg font-bold mb-4 flex items-center gap-2'>Available Orders</h1>


            <div className='space-y-4'>
              {deliverytask?.length > 0
                ?

                (deliverytask.map((a, index) => (

                  <div className='border rounded-lg p-4 flex justify-between items-center ' key={index}>
                    <div>
                      <p className='text-sm font-semibold '>{a?.shopName}</p>
                      <p className='text-sm text-gray-500'><span className='font-semibold'>Delivery Address :</span> {a?.deliveryAddress.text}</p>
                      <p className='text-xs text-gray-400'>{a.items.length} items | {a.subTotal}</p>
                    </div>
                    <button className='bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600'
                     onClick={() => acceptOrder(a.deliveryTaskid)}>Accept </button>
                  </div>
                ))) : (<p className='text-gray-400'>No Available Orders</p>)}
            </div>
          </div>}

        {riderOrder &&
          <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border  border-orange-100'>
            <h2 className='text-lg font-bold mb-3 '> 📦Current Order</h2>
            <div className='border rounded-lg p-4 mb-3'>
              <p className='font-semibold text-sm'>{riderOrder?.shopOrder.shop.name}</p>
              <p className='text-sm text-gray-900'>{riderOrder.deliveryAddress.text}</p>
              <p className='text-xs text-gray-600 '>{riderOrder.shopOrder.shopOrderItems.length} items | {riderOrder.shopOrder.subTotal}</p>
            </div>
            <DeliveryBoyTrackinig data={riderOrder} />
            {!showOtpBox ? <button className='mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl 
          shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200' onClick={sendOtp}>
              Mark as Delivered
            </button> : <div className='t-4 p-4 border rounded-xl bg-gray-50'>
              <p className='text-sm font-semibold mb-2'>Enter Otp sent to <span className='text-orange-500'>{riderOrder.user.fullName}</span> </p>
              <input type='text' className='w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400' placeholder='Enter Otp' onChange={(e) => setOtp(e.target.value)} value={otp} />
              <button className='w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all' onClick={verifyOtp}>Submit Otp</button>
            </div>}

          </div>}
      </div>
    </div>
  )
}

export default DeliveryBoy
