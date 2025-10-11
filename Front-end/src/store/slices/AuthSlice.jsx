import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const LoginUser=createAsyncThunk(
  "Auth/LoginUser",
    async(formData,{rejectWithValue})=>{
        try{
            const response=await axios.post('http://127.0.0.1:8000/api/login',formData)
      localStorage.setItem("token", response.data.token);
            return response.data

        }catch(err){
            return rejectWithValue(err.response?.data.errors || 'error inconnue')
        }
    }
)


const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    initialLoading: true,
    testMessage: "Hello from Redux Store!" // Nouveau state ajouté
  },
  reducers: {
    // Ajout d'un reducer pour modifier le message
    updateTestMessage: (state, action) => {
      state.testMessage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      
  },
});

export const { updateTestMessage } = AuthSlice.actions; // Export du nouveau reducer
export default AuthSlice.reducer;
