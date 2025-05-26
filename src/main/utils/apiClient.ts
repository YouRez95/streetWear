import { getToken } from '@/store/secure-store'
import axios from 'axios'
import { SERVER_URL } from './env'
import { getMainWindow } from './windowManager'

const apiClient = axios.create({
  baseURL: SERVER_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    console.error('Request error (apiClient):', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorCode = error.response?.data?.errorCode
    console.error('Response error response (apiClient):', error.response.data.errorCode)
    if (errorCode === 700 || errorCode === 701) {
      const win = getMainWindow()
      win?.webContents.send('force-logout')
    }
    return Promise.reject(error)
  }
)

export default apiClient
