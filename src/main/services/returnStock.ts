import apiClient from '@/utils/apiClient'

export const getReturnStock: GetReturnStock = async ({ page, limit, search, seasonId }) => {
  try {
    const result = await apiClient.get(
      `/api/v1/stock-return/all/${seasonId}?page=${page}&limit=${limit}&search=${search}`
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

export const deleteClientReturnStock: DeleteClientReturnStock = async (
  clientReturnId,
  seasonId
) => {
  try {
    const result = await apiClient.delete(
      `/api/v1/stock-return/delete/${seasonId}/${clientReturnId}`
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

export const updateClientReturnStock: UpdateClientReturnStock = async (updateOrderClientData) => {
  const { seasonId, clientReturnId, newQuantity } = updateOrderClientData
  try {
    const result = await apiClient.put(
      `/api/v1/stock-return/update/${seasonId}/${clientReturnId}`,
      { newQuantity }
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

export const getSummaryReturnStock: GetSummaryReturnStock = async (seasonId) => {
  try {
    const result = await apiClient.get(`/api/v1/stock-return/summary/${seasonId}`)
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

export const createOrderClientFromReturnStock: CreateOrderClientFromReturnStock = async (
  orderClientData
) => {
  const { seasonId, clientId, ...restData } = orderClientData

  try {
    const result = await apiClient.post(
      `/api/v1/stock-return/order/create/${seasonId}/${clientId}`,
      restData
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
