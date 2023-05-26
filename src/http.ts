import axios, { type AxiosRequestConfig, AxiosInstance } from 'axios'

export default class DiscordRequest {
  private _http: AxiosInstance
  constructor(token: string, version = 10) {
    this._http = axios.create({
      baseURL: `https://discord.com/api/v${version}`,
      timeout: 30000,
      headers: {
        Authorization: token
      }
    })
    this._http.interceptors.response.use(
      (res) => res.data,
      (error) => Promise.reject(error.response.data || error.message)
    )
  }

  get<T = any, D = any>(url: string, config?: AxiosRequestConfig) {
    return this._http.get<T, T, D>(url, config)
  }

  post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this._http.post<T, T, D>(url, data, config)
  }

  put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this._http.put<T, T, D>(url, data, config)
  }

  delete<T = any, D = any>(url: string, config?: AxiosRequestConfig) {
    return this._http.delete<T, T, D>(url, config)
  }
}
