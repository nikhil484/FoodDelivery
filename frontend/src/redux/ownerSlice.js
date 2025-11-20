import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
    name: "owner",
    initialState: {
       myShopData: null,  // Consistent: uppercase 'S'
    },
    reducers: {
        setMyShopData: (state, action) => {  // Consistent: uppercase 'S'
            state.myShopData = action.payload
        }    
    }
})

export const { setMyShopData } = ownerSlice.actions
export default ownerSlice.reducer