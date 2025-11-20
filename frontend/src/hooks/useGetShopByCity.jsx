import React, { useEffect } from 'react'
import axios from 'axios'
import { serverUrl} from  '/src/App.jsx'
import { useDispatch } from 'react-redux'
import { setShopInMyCity, setUserData } from '../redux/userSlice'
import { useSelector } from 'react-redux'
function useGetShopByCity() {
    const dispatch= useDispatch()
    const{currentCity}=useSelector(state=>state.user)
 useEffect(()=>{
     if (!currentCity) return
    const fetchShops= async()=>{try {
       const result= await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`,
            {withCredentials:true})
           dispatch(setShopInMyCity(result.data))
           console.log(result.data)
    } catch (error) {
          console.log(error)
         
    }}
        
     fetchShops()   

   
 },[currentCity])
}

export default useGetShopByCity
