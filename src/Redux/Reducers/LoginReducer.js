import { loginAsync } from "../Actions/LoginAction";
import { createSlice } from '@reduxjs/toolkit';
import { updateProfileAsync } from "../Actions/UpdateAction";
import { act } from "react";





const initialState = {
    first_name:null,
    last_name:null,
    loader:false,
    isAuthenticated:false,
    error:null,
    email:null,
    phone_number:null,
    user_id:null,
    user:null,

};



const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers:{
       
        logout(state,action){
            state.first_name = null,
            state.last_name = null,
            state.loader = false;
            state.isAuthenticated = false;
            state.error  = null
            state.email = null;
            state.phone_number = null;
            state.user = null
            localStorage.removeItem('authTokens');
        },
    },
    extraReducers: (builder) =>{
        builder
        .addCase(loginAsync.pending,(state)=>{
            state.loader = true
        })
        .addCase(loginAsync.fulfilled,(state,action)=>{
            state.loader = false;
            state.isAuthenticated = true;
            state.error = null;
            state.phone_number = action.payload.phone_number
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.email = action.payload.email
            state.user = {
                id:action.payload.user_id,
                first_name:action.payload.first_name,
                last_name: action.payload.last_name,
                email:action.payload.email,
                phone_number:action.payload.phone_number,
            }
           

        })
        .addCase(loginAsync.rejected,(state,action)=>{
            state.loader = false;   
            state.isAuthenticated = false
            state.error = action.payload || 'something went wrong';
            state.phone_number = null
            state.first_name = null
            state.last_name = null
            state.email = null
            state.user = null
        
        })
        .addCase(updateProfileAsync.pending,(state)=>{
            state.loader = true

        })
        .addCase(updateProfileAsync.fulfilled,(state,action)=>{
            state.loader = false
            state.first_name = action.payload.first_name || state.first_name  
            state.last_name = action.payload.last_name || state.last_name
            state.email = action.payload.email || state.email
            state.phone_number = action.payload.phone_number || state.phone_number
            state.error = null
         
        })
        .addCase(updateProfileAsync.rejected,(state,action) =>{
        state.loader = false;
        state.error = action.payload || 'Profile update failed';
        })
        

    }
})


export const {logout} = loginSlice.actions
export default loginSlice.reducer


