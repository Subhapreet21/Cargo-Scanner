import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const login = (data) => axiosInstance.post("/auth/login", data);
export const register = (data) => axiosInstance.post("/auth/register", data);

export const addProduct = (data) => axiosInstance.post("/products", data);
export const getProducts = () => axiosInstance.get("/products");
export const updateProduct = (id, data) => {
  console.log(id, data);
  if (!id) {
    throw new Error("Product ID is required to update a product.");
  }
  return axiosInstance.put(`/products/${id}`, data);
};
export const deleteProduct = (id) => {
  console.log(id);
  if (!id) {
    throw new Error("Product ID is required to delete a product.");
  }
  return axiosInstance.delete(`/products/${id}`);
};
