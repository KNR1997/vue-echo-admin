import axios, { type AxiosError } from "axios";
// hooks
import { useUserStore } from "@/store";
// utils
import { getToken } from "@/utils/auth/token";
// types
import type { ApiError } from "@/types";

// create an Axios instance
const baseURL = import.meta.env.VITE_APP_BASE_API?.trim() || "/api";

const Axios = axios.create({
  baseURL,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

Axios.interceptors.request.use(
  (config) => {
    const accessToken = getToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Change response data/error here
Axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const apiError = error.response?.data;

    if (error?.response?.status === 401) {
      try {
        const userStore = useUserStore();
        userStore.logout();
      } catch (error) {
        return;
      }
    }

    return Promise.reject({
      status: error.response?.status,
      message: apiError?.error || error.message,
      fields: apiError?.fields || {},
    });
  },
);

interface SearchParamOptions {
  name: string;
  username: string;
  module: string;
  summary: string;
  path: string;
  status: string;
}

export class HttpClient {
  static async get<T>(url: string, params?: unknown) {
    const response = await Axios.get<T>(url, { params });
    return response.data;
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    const response = await Axios.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(url: string, data: unknown) {
    const response = await Axios.put<T>(url, data);
    return response.data;
  }

  static async patch<T>(url: string, data: unknown) {
    const response = await Axios.patch<T>(url, data);
    return response.data;
  }

  static async delete<T>(url: string) {
    const response = await Axios.delete<T>(url);
    return response.data;
  }

  static formatSearchParams(params: Partial<SearchParamOptions>) {
    return Object.entries(params)
      .filter(([, value]) => Boolean(value))
      .map(([k, v]) =>
        ["slugSpecific"].includes(k) ? `${k}.slug:${v}` : `${k}:${v}`,
      )
      .join(";");
  }
}
