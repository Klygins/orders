import { configureStore } from '@reduxjs/toolkit'
import roleReducer from './slices/roleSlice'
import orderReducer from './slices/orderSlice'
import alertReducer from './slices/alertSlice'

export default configureStore({
  reducer: {
      role: roleReducer,
      orders: orderReducer,
      alert: alertReducer
  }
})