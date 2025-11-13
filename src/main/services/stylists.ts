import apiClient from '@/utils/apiClient'

export const getStylists: GetStylists = async (types, page, limit, searchTerm) => {
  //console.log('Types from main:', types)

  let type = ''
  if (types.length === 1) {
    type = types[0].slice(0, -1)
  }

  try {
    const response = await apiClient.get(
      `/api/v1/stylist/all?page=${page}&limit=${limit}&search=${searchTerm}&type=${type}`
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching stylists:', error)
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

export const createStylist: CreateStylist = async (stylist) => {
  try {
    const response = await apiClient.post('/api/v1/stylist/create', stylist)
    if (response.status === 201) {
      return {
        status: 'success',
        message: response.data.message,
        stylist: response.data.stylist
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error creating stylist:', error)
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

export const updateStylist: UpdateStylist = async (stylist) => {
  const { id, ...rest } = stylist
  try {
    const response = await apiClient.put(`/api/v1/stylist/update/${id}`, rest)
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        stylist: response.data.stylist
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating stylist:', error)
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

export const updateStylistStatus: UpdateStylistStatus = async (stylistId, status) => {
  try {
    const result = await apiClient.patch(`/api/v1/stylist/status/${stylistId}`, { status })
    //console.log('Update stylist status result:', result)
    if (result.status === 200) {
      return {
        status: 'success',
        message: result.data.message,
        stylist: result.data.stylist
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating stylist status:', error)
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

export const deleteStylist: DeleteStylist = async (stylistId) => {
  try {
    const response = await apiClient.delete(`/api/v1/stylist/delete/${stylistId}`)
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        stylist: response.data.stylist
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error deleting stylist:', error)
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

export const getActiveStylists: GetActiveStylists = async (
  seasonId,
  openBon = true,
  closedBon = false,
  search = ''
) => {
  try {
    const response = await apiClient.get(
      `/api/v1/stylist/active/${seasonId}?openBon=${openBon}&closedBon=${closedBon}&search=${search}`
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching active stylists:', error)
    return {
      status: 'failed',
      message: 'No response from server. Please try again later.'
    }
  }
}

export const createBonStylist: CreateBonStylist = async (bonData) => {
  const { seasonId, stylistId } = bonData
  try {
    const response = await apiClient.post(`/api/v1/stylist/bon/create/${seasonId}/${stylistId}`)
    return response.data
  } catch (error: any) {
    console.error('Error creating bon stylist:', error)
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

export const createOrderStylist: CreateOrderStylist = async (orderData) => {
  const { seasonId, stylistId, ...rest } = orderData
  try {
    const response = await apiClient.post(
      `/api/v1/stylist/order/create/${seasonId}/${stylistId}`,
      rest
    )
    return response.data
  } catch (error: any) {
    console.error('Error creating order stylist:', error)
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

export const createAvanceStylist: CreateAvanceStylist = async (avanceData) => {
  try {
    const { seasonId, stylistId, bonId, ...restData } = avanceData
    const result = await apiClient.post(
      `/api/v1/stylist/avance/create/${seasonId}/${stylistId}/${bonId}`,
      restData
    )
    //console.log('Create avance stylist result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error creating avance stylist:', error)
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

export const getOrdersStylist: GetOrdersStylist = async (
  seasonId,
  stylistId,
  bonId,
  queryParams
) => {
  try {
    const result = await apiClient.get(
      `/api/v1/stylist/bon/details/${seasonId}/${stylistId}/${bonId}?page=${queryParams?.page}&limit=${queryParams?.limit}&search=${queryParams?.search}&date=${queryParams?.date}`
    )
    //console.log('Get orders stylist result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error fetching orders stylist:', error)
    const { status, data } = error.response
    if (status === 400 && data.errors) {
      return {
        status: 'failed',
        message: data.errors[0].message || 'Validation error'
      }
    }

    //console.log('Error fetching orders stylist:', error.response)

    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}

export const updateOrderStylist: UpdateOrderStylist = async (updateOrderStylistData) => {
  const { orderId, formData, seasonId } = updateOrderStylistData
  try {
    const result = await apiClient.patch(
      `/api/v1/stylist/orders/update/${seasonId}/${orderId}`,
      formData
    )
    return result.data
  } catch (error: any) {
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

export const deleteOrderStylist: DeleteOrderStylist = async (orderId, seasonId) => {
  try {
    const result = await apiClient.delete(`/api/v1/stylist/orders/delete/${seasonId}/${orderId}`)
    //console.log('Delete order stylist result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error deleting order stylist:', error)
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

export const deleteAvanceStylist: DeleteAvanceStylist = async (avanceId, seasonId) => {
  try {
    const result = await apiClient.delete(`/api/v1/stylist/avances/delete/${seasonId}/${avanceId}`)
    //console.log('Delete avance stylist result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error deleting avance stylist:', error)
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

export const toggleBonStylist: ToggleBonStylist = async (bonId, seasonId, openBon, closeBon) => {
  try {
    const result = await apiClient.patch(
      `/api/v1/stylist/bon/${seasonId}/${bonId}?openBon=${openBon}&closeBon=${closeBon}`
    )
    //console.log('Open bon stylist result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error opening bon stylist:', error)
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

export const deleteBonStylist: DeleteBonStylist = async (bonId, seasonId) => {
  try {
    const result = await apiClient.delete(`/api/v1/stylist/bon/delete/${seasonId}/${bonId}`)
    //console.log('Delete bon stylist result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error deleting bon stylist:', error)
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

export const getStylistSummary: GetStylistSummary = async (seasonId, stylistId, bonId) => {
  try {
    const result = await apiClient.get(
      `/api/v1/stylist/bon/summary/${seasonId}/${stylistId}/${bonId}`
    )
    //console.log('Get stylist summary result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error fetching stylist summary:', error)
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
