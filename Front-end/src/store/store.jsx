import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";


const store = configureStore({
  reducer: {
    Auth: authReducer,
  },
});
export default store;
