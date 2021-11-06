import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name:'orders',
    initialState:{
        orders: []
    },
    reducers:{
        setOrders: (state, action) =>{
            state.orders = action.payload
        }
    }
})

export const {setOrders} = slice.actions

export default slice.reducer;