import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // place for BFF-based refresh later; for now, just bubble up
    return Promise.reject(error);
  }
);


