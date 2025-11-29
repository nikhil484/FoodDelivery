import React, { useEffect } from 'react'
import axios from 'axios'
import { serverUrl} from  '/src/App.jsx'
import { useDispatch } from 'react-redux'
import { setItemInMyCity } from '../redux/userSlice'
import { useSelector } from 'react-redux'
function useGetItemsByCity() {
    const dispatch= useDispatch()
    const{currentCity}=useSelector(state=>state.user)
 useEffect(()=>{
     if (!currentCity) return
    const fetchItems= async()=>{try {
       const result= await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`,
            {withCredentials:true})
           dispatch(setItemInMyCity(result.data))
        //    console.log(result.data)
    } catch (error) {
          console.log(error)
         
    }}
        
     fetchItems()   

   
 },[currentCity])
}

export default useGetItemsByCity
