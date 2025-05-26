import apiClient from '@/utils/apiClient'

export const getSeasons: GetSeasons = async (page, limit, search) => {
  try {
    const result = await apiClient.get(
      `/api/v1/season/all?page=${page}&limit=${limit}&search=${search}`
    )
    console.log('Get seasons result:', result)
    if (result.status === 200) {
      return result.data
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error fetching seasons:', error)
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

export const createSeason: CreateSeason = async (seasonData) => {
  try {
    const result = await apiClient.post('/api/v1/season/create', seasonData)
    console.log('Create season result:', result)
    if (result.status === 201) {
      return {
        status: 'success',
        message: result.data.message,
        season: result.data.season
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error creating season:', error)
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

export const updateSeason: UpdateSeason = async (seasonData) => {
  try {
    const { id: seasonId, ...restData } = seasonData
    const result = await apiClient.put(`/api/v1/season/update/${seasonId}`, restData)
    console.log('Update season result:', result)
    if (result.status === 200) {
      return {
        status: 'success',
        message: result.data.message,
        season: result.data.season
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating season:', error)
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

export const deleteSeason: DeleteSeason = async (seasonId) => {
  try {
    const result = await apiClient.delete(`/api/v1/season/delete/${seasonId}`)
    console.log('Delete season result:', result)
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
    console.error('Error deleting season:', error)
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
