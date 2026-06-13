import type { ApiError } from '@/types'
import { getToken } from '@/utils/auth/token'
import axios, { type AxiosError } from 'axios'

// create an Axios instance
const baseURL = import.meta.env.VITE_APP_BASE_API?.trim() || '/api'

const Axios = axios.create({
  baseURL,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
})

Axios.interceptors.request.use(
  (config) => {
    // 1️⃣ Dynamic base API (Electron setup)
    // const baseApi = baseURL();

    // 2️⃣ Inject auth token (Zustand-safe)
    // const { userToken } = useUserStore.getState();
    // const accessToken = userToken?.accessToken;

    const accessToken = getToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Change response data/error here
Axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const apiError = error.response?.data

    return Promise.reject({
      status: error.response?.status,
      message: apiError?.error || error.message,
      fields: apiError?.fields || {},
    })
  },
)

// Axios.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError<any>) => {
//     const { response, message } = error || {}

//     // const errMsg = response?.data?.message || message || t('sys.api.errorMessage')
//     // toast.error(errMsg, {
//     //   position: 'top-center',
//     // })

//     const status = response?.status
//     if (status === 401) {
//       // useUserStore.getState().actions.clearUserInfoAndToken(); // ✅ clear on 401
//       // useAppStore.getState().openSetup();
//     }

//     return Promise.reject(error)
//   },
// )

function formatBooleanSearchParam(key: string, value: boolean) {
  return value ? `${key}:1` : `${key}:`
}

interface SearchParamOptions {
  name: string
  username: string
}

export class HttpClient {
  static async get<T>(url: string, params?: unknown) {
    const response = await Axios.get<T>(url, { params })
    return response.data
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    const response = await Axios.post<T>(url, data, options)
    return response.data
  }

  static async put<T>(url: string, data: unknown) {
    const response = await Axios.put<T>(url, data)
    return response.data
  }

  static async patch<T>(url: string, data: unknown) {
    const response = await Axios.patch<T>(url, data)
    return response.data
  }

  static async delete<T>(url: string) {
    const response = await Axios.delete<T>(url)
    return response.data
  }

  static formatSearchParams(params: Partial<SearchParamOptions>) {
    return Object.entries(params)
      .filter(([, value]) => Boolean(value))
      .map(([k, v]) => (['slugSpecific'].includes(k) ? `${k}.slug:${v}` : `${k}:${v}`))
      .join(';')
  }
}
