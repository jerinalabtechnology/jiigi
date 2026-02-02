import axios from "axios";
import Router from "next/router";
import { store } from "../redux/store";
import { clearUserData } from "@/redux/reducers/userDataSlice";
import { clearCart } from "@/redux/reducers/cartSlice";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const getStoredToken = () => store.getState()?.userData?.token || null;

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ content type fix
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearUserData());
      store.dispatch(clearCart());
      Router.push("/");
    }
    return Promise.reject(error);
  }
);

export default api;
