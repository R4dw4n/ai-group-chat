import { message } from "antd";
import axios from "axios";
import { t } from "i18next";

export const HOST = "https://api.45-159-248-44.nip.io";
export const setTokens = (accessToken, refreshToken, chatToken, username, user) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('chatToken', chatToken);
  localStorage.setItem('username', username);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearLocalStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("chatToken");
  localStorage.removeItem("username");
  localStorage.removeItem("user");
}

export const axiosInstance = () => {
  const header = {
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("accessToken"),
  };
  const instance = axios.create({
    baseURL: HOST,
    headers: header,
  });

  // Add a response interceptor to check for authentication errors
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (!error.response) {
        message.error(t("failed_response"), 10);
      } else if (
        error.response &&
        error.response.data.message === "Unauthorized"
      ) {
        const originalRequest = error.config;
        originalRequest._retry = true;
        try {
          // Request to refresh the token
          console.log("Refreshing Token...");
          const response = await axios.post(HOST + "/auth/refresh", {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("refreshToken"),
            },
          });
          const { accessToken, authToken } = response.data;
          console.log("Token Refreshed!");
          // Store new tokens
          setTokens(accessToken, localStorage.getItem("refreshToken"), authToken, localStorage.getItem("username"), JSON.parse(localStorage.getItem("user")));
          // Update the Authorization header and retry the request
          instance.defaults.headers.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (err) {
          // If refresh token is also expired or invalid, log the user out
          // Handle logout here (e.g., redirect to login, clear storage)
          console.log("Refresh of token failed", err);
          clearLocalStorage();
          window.location.href = "/login";
        }
        // Redirect to login page or display error message
      } else if (error.response && error.response.status === 500) {
        message.error(t("failed_response"), 2);
      }
      return Promise.reject(error);
    }
  );
  return instance;
};