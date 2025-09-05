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
  getCurrentUser: async () => {
    return await axiosInstance().get("/auth/me")
  },
  updateProfile: async (data) => {
    return await axiosInstance().put("/auth/profile", data)
  },
  changePassword: async (data) => {
    return await axiosInstance().put("/auth/change-password", data)
  },
}