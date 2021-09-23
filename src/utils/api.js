import axios from 'axios'
import { Storage } from './storage'
import { decamelizeKeys, camelizeKeys } from 'humps'
import { AuthService } from '../services/auth'

export const API = axios.create({
  baseURL: process.env.GATSBY_HAPPETS_API_URL,
  transformRequest: [
    (data, headers) => {
      headers['Content-Type'] = 'application/json'
      headers['Accept'] = 'application/json'
      headers['Accept-Language'] = Storage.get('language') || 'es'
      return JSON.stringify(decamelizeKeys(data))
    },
  ],

  transformResponse: [
    data => {
      try {
        const parsedData = data ? JSON.parse(data) : null
        return parsedData ? camelizeKeys(parsedData) : null
      } catch (_e) {
        return null
      }
    },
  ],
})

API.interceptors.request.use(config => {
  if (!config.headers.Authorization) {
    API.defaults.headers.common['Authorization'] = tokenHeader()
    config.headers.Authorization = tokenHeader()
  }
  return config
})

API.interceptors.response.use(
  config => config,
  async error => {
    const { request, config } = error
    const token = Storage.get('token')

    // Prevent endless redirects (login is where you should end up)
    if (request !== undefined && !token) {
      setAuthHeader(undefined)
      return Promise.reject(error)
    }

    // Logout and go to login if refresh token action fails
    if (
      request !== undefined &&
      config.method === 'patch' &&
      request.status === 401 &&
      request.responseURL.includes('auth')
    ) {
      return AuthService.logout()
    } else if (
      request !== undefined &&
      request.status === 401 &&
      request.responseURL.includes('auth') &&
      request.responseURL.includes('pets')
    ) {
      return Promise.reject(error)
    } else if (request !== undefined && request.status === 401) {
      const refreshToken = await AuthService.refreshToken()
      Storage.set('token', refreshToken)
      config.headers.Authorization = 'Bearer ' + refreshToken
      return axios(config)
    }
    return Promise.reject(error)
  },
)

export const setAuthHeader = token => {
  Storage.set('token', token)
  API.defaults.headers.common['Authorization'] = tokenHeader()
}

export const tokenHeader = () => {
  const token = Storage.get('token')
  return 'Bearer ' + token
}
