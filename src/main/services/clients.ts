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
    //console.log('Create client result:', result)
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
    //console.log('Update client result:', result)
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

export const getActiveClients: GetActiveClients = async (
  seasonId,
  openBon = true,
  closedBon = false
) => {
  try {
    const result = await apiClient.get(
      `/api/v1/client/active/${seasonId}?openBon=${openBon}&closedBon=${closedBon}`
    )
    //console.log('Get active clients result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error fetching active clients:', error)
    return {
      status: 'failed',
      message: 'No response from server. Please try again later.'
    }
  }
}

export const getActiveClientsAndPassager: GetActiveClients = async (
  seasonId,
  openBon = true,
  closedBon = false
) => {
  try {
    const result = await apiClient.get(
      `/api/v1/client/active/passager/${seasonId}?openBon=${openBon}&closedBon=${closedBon}`
    )
    //console.log('Get active clients result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error fetching active clients:', error)
    return {
      status: 'failed',
      message: 'No response from server. Please try again later.'
    }
  }
}

export const createBonClient: CreateBonClient = async (bonData) => {
  try {
    const { seasonId, clientId } = bonData
    const result = await apiClient.post(`/api/v1/client/bon/create/${seasonId}/${clientId}`)
    //console.log('Create bon client result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error creating bon client:', error)
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

export const createBonClientPassager: CreateBonClientPassager = async (bonData) => {
  try {
    const { seasonId } = bonData
    const result = await apiClient.post(`/api/v1/client/bon/create/passager/${seasonId}`)
    return result.data
  } catch (error: any) {
    console.error('Error creating bon client:', error)
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

export const getBonsClientPassager: GetBonsClientPassager = async (seasonId) => {
  try {
    const result = await apiClient.get(`/api/v1/client/bon/passager/${seasonId}`)
    return result.data
  } catch (error: any) {
    console.error('Error get bon client passager:', error)
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

export const createOrderClient: CreateOrderClient = async (orderData) => {
  try {
    const { seasonId, clientId, ...restData } = orderData
    const endpoint = `/api/v1/client/order/create/${seasonId}/${clientId ?? 'passager'}`
    const result = await apiClient.post(endpoint, restData)
    //console.log('Create order client result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error creating order client:', error)
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

export const createMultipleOrdersClient: CreateMultipleOrdersClient = async (ordersData) => {
  try {
    const { seasonId, clientId, ...restData } = ordersData
    const result = await apiClient.post(
      `/api/v1/client/orders/create/${seasonId}/${clientId}`,
      restData
    )
    return result.data
  } catch (error: any) {
    console.error('Error creating order client:', error)
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

export const getOrdersClient: GetOrdersClient = async (seasonId, clientId, bonId, queryParams) => {
  try {
    const result = await apiClient.get(
      `/api/v1/client/bon/details/${seasonId}/${clientId}/${bonId}?page=${queryParams?.page}&limit=${queryParams?.limit}&search=${queryParams?.search}&date=${queryParams?.date}`
    )
    //console.log('Get orders client result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error fetching orders client:', error)
    const { status, data } = error.response
    if (status === 400 && data.errors) {
      return {
        status: 'failed',
        message: data.errors[0].message || 'Validation error'
      }
    }

    //console.log('Error fetching orders client:', error.response)

    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}

export const createAvanceClient: CreateAvanceClient = async (avanceData) => {
  try {
    const { seasonId, clientId, bonId, ...restData } = avanceData
    const result = await apiClient.post(
      `/api/v1/client/avance/create/${seasonId}/${clientId}/${bonId}`,
      restData
    )
    //console.log('Create avance client result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error creating avance client:', error)
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

export const getClientSummary: GetClientSummary = async (seasonId, clientId, bonId) => {
  try {
    const result = await apiClient.get(
      `/api/v1/client/bon/summary/${seasonId}/${clientId}/${bonId}`
    )
    //console.log('Get client summary result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error fetching client summary:', error)
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

export const deleteAvanceClient: DeleteAvanceClient = async (avanceId, seasonId) => {
  try {
    const result = await apiClient.delete(`/api/v1/client/avances/delete/${seasonId}/${avanceId}`)
    //console.log('Delete avance client result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error deleting avance client:', error)
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

export const deleteOrderClient: DeleteOrderClient = async (orderId, seasonId) => {
  try {
    const result = await apiClient.delete(`/api/v1/client/orders/delete/${seasonId}/${orderId}`)
    //console.log('Delete order client result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error deleting order client:', error)
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

export const toggleBonClient: ToggleBonClient = async (toggleData) => {
  const { bonId, closeBon, openBon, seasonId, remise } = toggleData

  try {
    const result = await apiClient.patch(
      `/api/v1/client/bon/${seasonId}/${bonId}?openBon=${openBon}&closeBon=${closeBon}`,
      { remise: remise ? remise : 0 }
    )
    //console.log('Open bon client result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error opening bon client:', error)
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

export const deleteBonClient: DeleteBonClient = async (bonId, seasonId) => {
  try {
    const result = await apiClient.delete(`/api/v1/client/bon/delete/${seasonId}/${bonId}`)
    //console.log('Delete bon client result:', result)
    return result.data
  } catch (error: any) {
    console.error('Error deleting bon client:', error)
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

export const updateOrderClient: UpdateOrderClient = async (updateOrderClientData) => {
  const { orderId, formData, seasonId } = updateOrderClientData
  console.log('Updating order client with data:', updateOrderClientData)
  try {
    const result = await apiClient.patch(
      `/api/v1/client/orders/update/${seasonId}/${orderId}`,
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
