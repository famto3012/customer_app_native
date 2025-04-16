import axios from "axios";
import { BASE_URL } from "@/constants/links";
import { useAuthStore } from "@/store/store";
import { logout } from "@/service/authService";

export const appAxios = axios.create({
  baseURL: BASE_URL,
});

// Handle token refresh logic
const refreshAccessToken = async () => {
  try {
    const { refreshToken, setToken, setRefreshToken } = useAuthStore.getState();

    if (!refreshToken) {
      logout();
      return null;
    }

    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });

    const { newToken, newRefreshToken } = response.data;

    setToken(newToken);
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
    }

    return newToken;
  } catch (err) {
    console.log(`Error in getting new token: ${err}`);
    logout();
    return null;
  }
};

// Axios request interceptor
appAxios.interceptors.request.use(async (config) => {
  const { token } = useAuthStore.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Axios response interceptor
appAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config);
        }
      } catch (err) {
        console.log(`Error refreshing token: ${err}`);
        logout();
      }
    }

    return Promise.reject(error);
  }
);
