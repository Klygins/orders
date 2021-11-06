import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'alert',
    initialState: {
        alert: {
            alertVisiable: false, isAlertColorBlue: false,
            alertMessage: 'placeholder'
        }
    },
    reducers: {
        setAlert: (state, action) => {
            state.alert = action.payload
        }
    }
})

export const { setAlert } = slice.actions

export default slice.reducer;