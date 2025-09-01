import { axiosInstance } from "../axiosInstance"

export const groupsService = {
  create: async (data) => {
    return await axiosInstance().post("/groups", data)
  },
  addAvatar: async (id, data) => {
    console.log('data', data)
    return await axiosInstance().postForm(`/groups/${id}/avatar`, data)
  },
  getAll: async (params) => {
    return await axiosInstance().get("/users/groups", {
      params: {
        ...params
      }
    })
  },
  getGroup: async (id) => {
    return await axiosInstance().get(`/groups/${id}`)
  },
  getMessages: async (id, params) => {
    return await axiosInstance().get(`/groups/${id}/messages`, {
      params: {
        ...params,
      }
    })
  },
  rename: async (id, data) => {
    return await axiosInstance().post(`/groups/rename/${id}`, data)
  },
  addUsers: async (id, data) => {
    return await axiosInstance().post(`/groups/${id}/add-users`, data)
  },
  remove: async (id, data) => {
    return await axiosInstance().post(`/groups/${id}/remove-user`, data)
  },
  members: async (id) => {
    return await axiosInstance().get(`/groups/${id}/members`)
  },
  delete: async (id) => {
    return await axiosInstance().get(`/groups/delete/${id}`)
  },
  searchUser: async (params) => {
    return await axiosInstance().get("/users/autocomplete", {
      params: {
        ...params
      }
    })
  }
}