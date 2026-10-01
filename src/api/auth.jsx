import apiClient from "./client";

export const login = async(email,password) =>{
    const response = await apiClient.post('/Auth/login',{email,password});
    return response.data;
}