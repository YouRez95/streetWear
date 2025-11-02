import apiClient from '@/utils/apiClient'
import { getMimeTypeFromFileName } from '@/utils/getMimeType'

export const getProducts: GetProducts = async ({ page, limit, search, seasonId, date }) => {
  try {
    const result = await apiClient.get(
      `/api/v1/product/all/${seasonId}?page=${page}&limit=${limit}&search=${search}&date=${date}`
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

export const createProduct: CreateProduct = async (product, seasonId: string) => {
  try {
    const formData = new FormData()
    const fields = [
      'name',
      'reference',
      'type',
      'totalQty',
      'description',
      'createdAt',
      'poids',
      'metrage',
      'readyQty'
    ]

    for (const key of fields) {
      formData.append(key, product[key] || '')
    }

    if (product.productImage) {
      const mimeType = getMimeTypeFromFileName(product.fileName || '')
      const blob = new Blob([product.productImage], { type: mimeType })
      formData.append('productImage', blob, product.fileName || 'image.png')
    }

    const result = await apiClient.post(`/api/v1/product/create/${seasonId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (result.status === 201) {
      return {
        status: 'success',
        message: result.data.message,
        product: result.data.product
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
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

export const updateProduct: UpdateProduct = async (product, seasonId) => {
  try {
    const formData = new FormData()
    const fields = [
      'name',
      'reference',
      'type',
      'totalQty',
      'description',
      'createdAt',
      'poids',
      'metrage',
      'readyQty'
    ]

    for (const key of fields) {
      formData.append(key, product[key] || '')
    }

    if (product.productImage) {
      const mimeType = getMimeTypeFromFileName(product.fileName || '')
      const blob = new Blob([product.productImage], { type: mimeType })
      formData.append('productImage', blob, product.fileName || 'image.png')
    }

    const result = await apiClient.put(
      `/api/v1/product/update/${seasonId}/${product.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    if (result.status === 200) {
      return {
        status: 'success',
        message: result.data.message,
        product: result.data.product
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
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

export const deleteProduct: DeleteProduct = async (productId, seasonId) => {
  try {
    const result = await apiClient.delete(`/api/v1/product/delete/${seasonId}/${productId}`)
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

export const getAllProductsStatus: GetAllProductsStatus = async (seasonId) => {
  try {
    const result = await apiClient.get(`/api/v1/product/all/status/${seasonId}`)
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
