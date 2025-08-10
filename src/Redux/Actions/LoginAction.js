import { BASE_URL } from '../../services/constant';
import {createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';


export const loginAsync = createAsyncThunk(
    'login/loginAsync',
    async(loginData,{rejectWithValue})=>{
        try{
            const response = await axios.post(`${BASE_URL}/user/token/`,loginData);

            const token = response.data;

            const tokens = { access: token.access, refresh: token.refresh };
            localStorage.setItem('authTokens', JSON.stringify(tokens));

            // Decode the JWT token
            const decodeToken = JSON.parse(atob(token.access.split('.')[1]));

            const {email,first_name,phone_number,last_name,user_id } = decodeToken;

            // Return required details
            return {email,first_name,phone_number,last_name,user_id};
        }catch(error){
            return rejectWithValue(error?.message || 'something went wrong');

        }
    }
)