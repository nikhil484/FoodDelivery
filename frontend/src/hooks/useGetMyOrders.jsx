import React, { useEffect } from 'react'
import axios from 'axios'
import { serverUrl} from  '/src/App.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders } from '../redux/userSlice.js'

function useGetMyOrders() {
    const dispatch= useDispatch()
    const {userData}=useSelector(state=>state.user)
 useEffect(()=>{
    const fetchOrders= async()=>{try {
       const result= await axios.get(`${serverUrl}/api/order/my-orders`,
            {withCredentials:true})
           dispatch(setMyOrders(result.data))
         //   console.log("fetched orders",result.data)
    } catch (error) {
          console.log(error)
         
    }}
        
     fetchOrders()   

   
 },[userData])
}

export default useGetMyOrders
