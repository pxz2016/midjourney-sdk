import axios, { type AxiosRequestConfig, AxiosInstance } from 'axios'

export default class DiscordRequest {
  #http: AxiosInstance
  constructor(token: string, version = 9) {
    this.#http = axios.create({
      baseURL: `https://discord.com/api/v${version}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
    this.#http.interceptors.response.use(
      (res) => res.data,
      (error) => Promise.reject(error.response?.data || error.message)
    )
  }

  get<T = any, D = any>(url: string, config?: AxiosRequestConfig) {
    return this.#http.get<T, T, D>(url, config)
  }

  post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.#http.post<T, T, D>(url, data, config)
  }

  put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.#http.put<T, T, D>(url, data, config)
  }

  delete<T = any, D = any>(url: string, config?: AxiosRequestConfig) {
    return this.#http.delete<T, T, D>(url, config)
  }
}
