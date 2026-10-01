import apiClient from "./client";

export const getLoans = async () => {
    const response = await apiClient.get("/Loans/active");  
    return response.data;
};

export const getActiveLoans = async () => {
    const response = await apiClient.get("/Loans/active");
    return response.data;
};

export const createLoan = async (loanData) => {
    const response = await apiClient.post("/Loans", loanData);
    return response.data;
};

export const returnLoan = async (id) => {
    const response = await apiClient.patch(`/Loans/${id}/return`);
    return response.data;
};

export const getMyLoans = async () => {
    const response = await apiClient.get("/Loans/mine");  
    return response.data;
};