import apiClient from '@/utils/apiClient'

export const getFaconniers: GetFaconniers = async (page, limit, search) => {
  try {
    const result = await apiClient.get(
      `/api/v1/faconnier/all?page=${page}&limit=${limit}&search=${search}`
    )
    return result.data
  } catch (error: any) {
    console.error('Error fetching faconniers:', error)
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

export const createFaconnier: CreateFaconnier = async (userData) => {
  try {
    const result = await apiClient.post('/api/v1/faconnier/create', userData)
    console.log('Create faconnier result:', result)
    if (result.status === 201) {
      return {
        status: 'success',
        message: result.data.message,
        faconnier: result.data.faconnier
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error creating faconnier:', error)
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

export const deleteFaconnier: DeleteFaconnier = async (faconnierId) => {
  try {
    const result = await apiClient.delete(`/api/v1/faconnier/delete/${faconnierId}`)
    console.log('Delete faconnier result:', result)
    if (result.status === 200) {
      return {
        status: 'success',
        message: result.data.message,
        faconnier: result.data.faconnier
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error deleting faconnier:', error)
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

export const updateFaconnier: UpdateFaconnier = async (faconnierData) => {
  const { id: faconnierId, ...restData } = faconnierData

  try {
    const result = await apiClient.put(`/api/v1/faconnier/update/${faconnierId}`, restData)
    console.log('Update faconnier result:', result)
    if (result.status === 200) {
      return {
        status: 'success',
        message: result.data.message,
        faconnier: result.data.faconnier
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating faconnier:', error)
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

export const updateFaconnierStatus: UpdateFaconnierStatus = async (faconnierId, status) => {
  try {
    const result = await apiClient.patch(`/api/v1/faconnier/status/${faconnierId}`, { status })
    console.log('Update faconnier status result:', result)
    if (result.status === 200) {
      return {
        status: 'success',
        message: result.data.message,
        faconnier: result.data.faconnier
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating faconnier status:', error)
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

export const getActiveFaconniers: GetActiveFaconniers = async (
  seasonId,
  openBon = true,
  closedBon = false
) => {
  try {
    const result = await apiClient.get(
      `/api/v1/faconnier/active/${seasonId}?openBon=${openBon}&closedBon=${closedBon}`
    )
    console.log('Get active faconniers result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error fetching active faconniers:', error)
    return {
      status: 'failed',
      message: 'No response from server. Please try again later.'
    }
  }
}

export const createBonFaconnier: CreateBonFaconnier = async (bonData) => {
  try {
    const { seasonId, faconnierId } = bonData
    const result = await apiClient.post(`/api/v1/faconnier/bon/create/${seasonId}/${faconnierId}`)
    console.log('Create bon faconnier result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error creating bon faconnier:', error)
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

export const createOrderFaconnier: CreateOrderFaconnier = async (orderData) => {
  try {
    const { seasonId, faconnierId, ...restData } = orderData
    const result = await apiClient.post(
      `/api/v1/faconnier/order/create/${seasonId}/${faconnierId}`,
      restData
    )
    console.log('Create order faconnier result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error creating order faconnier:', error)
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

export const getOrdersFaconnier: GetOrdersFaconnier = async (seasonId, faconnierId, bonId) => {
  try {
    const result = await apiClient.get(
      `/api/v1/faconnier/bon/details/${seasonId}/${faconnierId}/${bonId}`
    )
    console.log('Get orders faconnier result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error fetching orders faconnier:', error)
    const { status, data } = error.response
    if (status === 400 && data.errors) {
      return {
        status: 'failed',
        message: data.errors[0].message || 'Validation error'
      }
    }

    console.log('Error fetching orders faconnier:', error.response)

    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}

export const createAvanceFaconnier: CreateAvanceFaconnier = async (avanceData) => {
  try {
    const { seasonId, faconnierId, bonId, ...restData } = avanceData
    const result = await apiClient.post(
      `/api/v1/faconnier/avance/create/${seasonId}/${faconnierId}/${bonId}`,
      restData
    )
    console.log('Create avance faconnier result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error creating avance faconnier:', error)
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

export const getFaconnierSummary: GetFaconnierSummary = async (seasonId, faconnierId, bonId) => {
  try {
    const result = await apiClient.get(
      `/api/v1/faconnier/bon/summary/${seasonId}/${faconnierId}/${bonId}`
    )
    console.log('Get faconnier summary result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error fetching faconnier summary:', error)
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

export const deleteAvanceFaconnier: DeleteAvanceFaconnier = async (avanceId) => {
  try {
    const result = await apiClient.delete(`/api/v1/faconnier/avances/delete/${avanceId}`)
    console.log('Delete avance faconnier result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error deleting avance faconnier:', error)
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

export const deleteOrderFaconnier: DeleteOrderFaconnier = async (orderId) => {
  try {
    const result = await apiClient.delete(`/api/v1/faconnier/orders/delete/${orderId}`)
    console.log('Delete order faconnier result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error deleting order faconnier:', error)
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

export const toggleBonFaconnier: ToggleBonFaconnier = async (bonId, openBon, closeBon) => {
  try {
    const result = await apiClient.patch(
      `/api/v1/faconnier/bon/${bonId}?openBon=${openBon}&closeBon=${closeBon}`
    )
    console.log('Open bon faconnier result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error opening bon faconnier:', error)
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

export const deleteBonFaconnier: DeleteBonFaconnier = async (bonId) => {
  try {
    const result = await apiClient.delete(`/api/v1/faconnier/bon/delete/${bonId}`)
    console.log('Delete bon faconnier result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error deleting bon faconnier:', error)
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
