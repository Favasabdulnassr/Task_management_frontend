import axios from 'axios'
import { BASE_URL } from './constant';


/**
 * Fetches a new access token using the stored refresh token.
 *
 * @returns {Promise<string>} - A promise that resolves to the new access token.
 * @throws {Error} - Throws an error if the request fails or if no refresh token is available.
 */

export const fetchNewAccessToken = async () =>{
    try {
        const token = JSON.parse(localStorage.getItem('authTokens'))
        console.log('token from refresh.js=====',token);
        
        const refreshToken = token?.refresh
        console.log('============================',refreshToken);
        
        if(!refreshToken){
            throw new Error('No refresh token found')
            
        }
        const response = await axios.post(BASE_URL + '/user/token/refresh/',{refresh:refreshToken});

        return response;
        
    } catch (error) {
        console.log('===error from refresh ==',error);
        
        throw error
        
    }
}