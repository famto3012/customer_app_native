import { BASE_URL } from "@/constants/links";
import { logout } from "@/service/authService";
import { useAuthStore } from "@/store/store";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";

export const appAxios = axios.create({
  baseURL: BASE_URL,
});

let isRefreshingToken = false;
let requestQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  requestQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  requestQueue = [];
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = decoded.exp - currentTime;

    // Consider it "near expiry" if less than 1 minute remaining
    return remainingTime < 60;
  } catch (err) {
    console.error("Error decoding token:", err);
    return true;
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  const { refreshToken, setToken, setRefreshToken } = useAuthStore.getState();

  if (!refreshToken) {
    logout();
    processQueue("No refresh token available", null);
    return null;
  }

  if (isRefreshingToken) {
    return new Promise((resolve, reject) => {
      requestQueue.push({ resolve, reject });
    });
  }

  isRefreshingToken = true;

  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });

    const { newToken, newRefreshToken } = response.data;

    setToken(newToken);
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
    }

    isRefreshingToken = false;
    processQueue(null, newToken);
    return newToken;
  } catch (err) {
    console.error(`Error in getting new token: ${err}`);
    logout();
    isRefreshingToken = false;
    processQueue(err, null);
    return null;
  }
};

appAxios.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const { token } = useAuthStore.getState();

    if (token) {
      // Check token expiry before making the request
      if (isTokenExpired(token)) {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            config.headers = config.headers ?? {};
            config.headers["Authorization"] = `Bearer ${newToken}`;
          }
        } catch (err) {
          console.error("Error during token refresh:", err);
          throw err;
        }
      } else {
        config.headers = config.headers ?? {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

appAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (
    error: AxiosError
  ): Promise<AxiosResponse | Promise<AxiosResponse>> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();

        if (newToken) {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return appAxios(originalRequest);
        }
      } catch (err) {
        console.error(`Error refreshing token: ${err}`);
        logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
