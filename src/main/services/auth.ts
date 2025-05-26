import { deleteToken, saveToken } from '@/store/secure-store'
import { SERVER_URL } from '@/utils/env'
import axios from 'axios'
import { removeFromStore, setToStore } from '../store/store'

export const loginUser = async (userCredentials: LoginFormType) => {
  console.log('Logging in with credentials:', userCredentials)
  try {
    const response = await axios.post(`${SERVER_URL}/api/v1/user/login`, {
      email: userCredentials.email,
      password: userCredentials.password
    })

    if (response.status === 200) {
      // WIP: Store the token in keytar response.data.accessToken
      console.log('Login successful in main:', response.data)
      await saveToken(response.data.accessToken)
      // store the user data in the store
      setToStore('user', response.data.user)
      return {
        status: 'success',
        message: response.data.message,
        user: response.data.user
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response
      return {
        status: 'failed',
        message: data.message || data.errors
      }
    }

    console.error('No response from server:', error.request)
    return {
      status: 'failed',
      message: 'No response from server. Please try again later.'
    }
  }
}

export const logoutUser = async () => {
  try {
    // Remove the token from keytar
    await deleteToken()
    // Remove the user data from the disk store
    removeFromStore('user')
    return {
      status: 'success',
      message: 'Logged out successfully.'
    }
  } catch (error) {
    console.error('Error during logout:', error)
    return {
      status: 'failed',
      message: 'Logout failed. Please try again.'
    }
  }
}
