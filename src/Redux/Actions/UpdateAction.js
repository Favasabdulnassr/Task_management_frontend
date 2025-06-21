import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/interceptor";

export const updateProfileAsync = createAsyncThunk(
    'update/updateProfileAsync',    
    async(profileData,{rejectWithValue}) => {
        try {
            const response = await axiosInstance.put('/user/profile/update/',profileData);

            console.log('profile updated',response.data)

            return response.data

        }catch(error){
            console.error('errerrrrerrrr',error)
            return rejectWithValue(error?.message||'profile update failed');
        }
    }
)