import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL } from "@/constants/links";
import { useAuthStore } from "@/store/store";
import { logout } from "@/service/authService";

export const appAxios = axios.create({
  baseURL: BASE_URL,
});

let isRefreshingToken = false;
let requestQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

/**
 * Process the request queue.
 * @param error Error object or null.
 * @param token New access token or null.
 */
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

/**
 * Refresh the access token.
 * If a refresh is already in progress, requests are queued.
 */
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

/**
 * Request Interceptor
 */
appAxios.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const { token } = useAuthStore.getState();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Response Interceptor
 */
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
