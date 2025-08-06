import apiClient from '@/utils/apiClient'

export const getGeneralSettings: GetGeneralSettings = async () => {
  try {
    const result = await apiClient.get('/api/v1/dashboard/settings/general')
    return result.data
  } catch (error: any) {
    console.error('Error fetching general settings:', error)
    const { data } = error.response
    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}

export const getSummary: GetSummary = async (seasonId) => {
  try {
    const result = await apiClient.get(`/api/v1/dashboard/summary/${seasonId}`)
    return result.data
  } catch (error: any) {
    console.error('Error fetching summary:', error)
    const { data } = error.response
    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}

export const getRetardOrdersFaconnier: GetRetardOrdersFaconnier = async (seasonId) => {
  try {
    const result = await apiClient.get(`/api/v1/dashboard/faconniers-retard/${seasonId}`)
    return result.data
  } catch (error: any) {
    console.error('Error fetching retard orders façonnier:', error)
    const { data } = error.response
    return {
      status: 'failed',
      message: data.message || 'No response from server. Please try again later.'
    }
  }
}
