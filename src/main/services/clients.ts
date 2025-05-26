import apiClient from '@/utils/apiClient'

export const getClients: GetClients = async (page, limit, search) => {
  try {
    const result = await apiClient.get(
      `/api/v1/client/all?page=${page}&limit=${limit}&search=${search}`
    )
    return result.data
  } catch (error: any) {
    console.error('Error fetching clients:', error)
    const { status, data } = error.response
    if (status === 400 && data.errors) {
      return {
        status: 'failed',
        message: data.errors[0].message || 'Validation error'
      }
    }

    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}

export const createClient: CreateClient = async (clientData) => {
  try {
    const result = await apiClient.post('/api/v1/client/create', clientData)
    console.log('Create client result:', result)
    if (result.status === 201) {
      return {
        status: 'success',
        message: result.data.message,
        client: result.data.client
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error creating client:', error)
    const { status, data } = error.response
    if (status === 400 && data.errors) {
      return {
        status: 'failed',
        message: data.errors[0].message || 'Validation error'
      }
    }

    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}

export const deleteClient: DeleteClient = async (clientId) => {
  try {
    const result = await apiClient.delete(`/api/v1/client/delete/${clientId}`)
    return result.data
  } catch (error: any) {
    console.error('Error deleting client:', error)
    const { status, data } = error.response
    if (status === 400 && data.errors) {
      return {
        status: 'failed',
        message: data.errors[0].message || 'Validation error'
      }
    }

    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}

export const updateClient: UpdateClient = async (clientData) => {
  const { id: clientId, ...restData } = clientData
  try {
    const result = await apiClient.put(`/api/v1/client/update/${clientId}`, restData)
    console.log('Update client result:', result)
    if (result.status === 200) {
      return {
        status: 'success',
        message: result.data.message,
        client: result.data.client
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating client:', error)
    const { status, data } = error.response
    if (status === 400 && data.errors) {
      return {
        status: 'failed',
        message: data.errors[0].message || 'Validation error'
      }
    }

    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}

export const updateClientStatus: UpdateClientStatus = async (clientId, status) => {
  try {
    const result = await apiClient.patch(`/api/v1/client/status/${clientId}`, { status })
    return result.data
  } catch (error: any) {
    console.error('Error updating client status:', error)
    const { status, data } = error.response
    if (status === 400 && data.errors) {
      return {
        status: 'failed',
        message: data.errors[0].message || 'Validation error'
      }
    }

    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}
