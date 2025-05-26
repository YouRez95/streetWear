import apiClient from '@/utils/apiClient'
import { getMimeTypeFromFileName } from '@/utils/getMimeType'

export const getUsers: GetUsers = async (page, limit, search) => {
  try {
    const result = await apiClient.get(
      `/api/v1/user/all?page=${page}&limit=${limit}&search=${search}`
    )
    return result.data
  } catch (error: any) {
    console.error('Error fetching users:', error)
    const { status, data } = error.response
    if (status === 400) {
      return {
        status: 'failed',
        message: data.errors[0].message
      }
    }

    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}

export const createUser: CreateUser = async (userData) => {
  try {
    const formData = new FormData()
    const fields = ['name', 'email', 'role', 'password', 'phone', 'address']

    for (const key of fields) {
      formData.append(key, userData[key] || '')
    }

    if (userData.image) {
      console.log('userData.image', userData)
      const mimeType = getMimeTypeFromFileName(userData.fileName || '')
      const blob = new Blob([userData.image], { type: mimeType })
      formData.append('profileImage', blob, userData.fileName || 'image.png')
    }

    const result = await apiClient.post('/api/v1/user/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('Create user result:', result)

    if (result.status === 201) {
      return {
        status: 'success',
        message: result.data.message,
        user: result.data.user
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error creating user main :', error)
    const { status, data } = error.response
    if (status === 400 && data.errors) {
      return {
        status: 'failed',
        message: data.errors[0].message
      }
    }

    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}

export const deleteUser: DeleteUser = async (userId) => {
  try {
    const result = await apiClient.delete(`/api/v1/user/delete/${userId}`)

    console.log('Delete user result:', result)
    if (result.status === 200) {
      return {
        status: 'success',
        message: result.data.message
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error deleting user:', error)
    const { status, data } = error.response
    if (status === 400) {
      return {
        status: 'failed',
        message: data.errors[0].message
      }
    }

    // console.log('Error deleting user:', status, data)

    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}

export const updateUser: UpdateUser = async (userData) => {
  try {
    const formData = new FormData()
    const fields = ['name', 'email', 'role', 'password', 'phone', 'address']

    for (const key of fields) {
      if (key === 'password' && !userData.password) continue
      formData.append(key, userData[key] || '')
    }

    if (userData.image) {
      console.log('userData.image', userData)
      const mimeType = getMimeTypeFromFileName(userData.fileName || '')
      const blob = new Blob([userData.image], { type: mimeType })
      formData.append('profileImage', blob, userData.fileName || 'image.png')
    }

    console.log('formData inside update', formData)

    const result = await apiClient.put(`/api/v1/user/update/${userData.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('Update user result:', result)

    if (result.status === 200) {
      return {
        status: 'success',
        message: result.data.message,
        user: result.data.user
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating user:', error)
    const { status, data } = error.response
    if (status === 400) {
      return {
        status: 'failed',
        message: data.errors[0].message
      }
    }

    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}
