import { axiosInstance } from "../axiosInstance"

export const authService = {
  register: async (data) => {
    return await axiosInstance().post("/auth/signup", data)
  },
  login: async (data) => {
    return await axiosInstance().post("/auth/login", data)
  },
  logout: async () => {
    return await axiosInstance().post("/auth/logout")
  },
}