import axios from "axios";
import { fetchNewAccessToken } from "./refresh";
import { logout } from "../Redux/Reducers/LoginReducer";
import { BASE_URL } from "./constant";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});





// Define a function to handle token refresh and logout
export const setupAxiosInterceptors = (dispatch) => {
  // Request Interceptor to add Authorization header
  axiosInstance.interceptors.request.use(
    (config) => {
      const tokens = JSON.parse(localStorage.getItem('authTokens'));
      const token = tokens?.access;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor to handle token expiration
  axiosInstance.interceptors.response.use(
    (response) => {

        
      return response
    },
    
    async (error) => {

      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
         
        try {
          // Fetch new access token
          const response = await fetchNewAccessToken();
          const newAccessToken = response.data;
          const tokens = { access: newAccessToken.access, refresh: newAccessToken.refresh };
          
          // Store the new tokens in localStorage
          localStorage.setItem("authTokens", JSON.stringify(tokens));

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        } catch (error) {
          toast.error("Refresh token is invalid. Logging out...",error);

   
          dispatch(logout());  
         
          return Promise.reject(error);
        }
      }

      
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;