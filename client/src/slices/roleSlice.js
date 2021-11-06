import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name:'role',
    initialState:{
        role: 0
    },
    reducers:{
        setRole: (state, action) =>{
            state.role = action.payload
        }
    }
})

export const {setRole} = slice.actions

export default slice.reducer;