import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useParams } from 'react-router-dom'

function Shop() {
    const {shopId}=useParams()
    const handleShop= async()=>{
        try {
            const result= await axios.get(`${serverUrl}/api/item/getitem-by-shop/${shopId}`,{withCredentials:true})
            console.log(result.data)
        } catch (error) {
            console.log(error)
            
        }
    }
    useEffect(()=>{
         handleShop()
    },[shopId])
  return (
    <div>
      
    </div>
  )
}

export default Shop
