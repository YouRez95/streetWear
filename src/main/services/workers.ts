import apiClient from '@/utils/apiClient'

export const createWorkPlace: CreateWorkPlace = async (workPlaceData) => {
  try {
    const response = await apiClient.post('/api/v1/worker/workplace/create', workPlaceData)

    if (response.status === 201) {
      return {
        status: 'success',
        message: response.data.message,
        workplace: response.data.workplace
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error creating workplace:', error)
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

export const getWorkPlaces: GetWorkPlaces = async (page, limit, search) => {
  try {
    const result = await apiClient.get(
      `/api/v1/worker/workplace/all?page=${page}&limit=${limit}&search=${search}`
    )
    return result.data
  } catch (error: any) {
    console.error('Error fetching workplaces:', error)
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

export const getWorkPlacesByCursor: GetWorkPlacesByCursor = async ({ take, cursor, search }) => {
  try {
    const result = await apiClient.get(
      `/api/v1/worker/workplace/cursor?take=${take}&cursor=${cursor}&search=${search}`
    )
    return result.data
  } catch (error: any) {
    console.error('Error fetching workplaces by cursor:', error)
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

export const updateWorkplace: UpdateWorkplace = async (workplace) => {
  const { id, ...rest } = workplace
  try {
    const response = await apiClient.patch(`/api/v1/worker/workplace/${id}`, rest)
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        workplace: response.data.workplace
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating workplace:', error)
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

export const deleteWorkplace: DeleteWorkplace = async (workplaceId) => {
  try {
    const response = await apiClient.delete(`/api/v1/worker/workplace/${workplaceId}`)
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        workplace: response.data.workplace
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error deleting workplace:', error)
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

export const createWorker: CreateWorker = async (workerData) => {
  try {
    const response = await apiClient.post('/api/v1/worker/create', workerData)
    if (response.status === 201) {
      return {
        status: 'success',
        message: response.data.message,
        worker: response.data.worker
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (err: any) {
    console.error('Error creating worker:', err)
    const { status, data } = err.response
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

export const getWorkers: GetWorkers = async (active, page, limit, search) => {
  let type = ''
  if (active.length === 1) {
    type = active[0]
  }

  try {
    const result = await apiClient.get(
      `/api/v1/worker/all?page=${page}&limit=${limit}&search=${search}&type=${type}`
    )
    return result.data
  } catch (error: any) {
    console.error('Error fetching workers:', error)
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

export const getWorkersCursor: GetWorkersByCursor = async ({ take, cursor, search }) => {
  try {
    const result = await apiClient.get(
      `/api/v1/worker/cursor?take=${take}&cursor=${cursor}&search=${search}`
    )
    return result.data
  } catch (error: any) {
    console.error('Error fetching workers by cursor:', error)
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

export const updateWorker: UpdateWorker = async (workerData) => {
  const { id, ...rest } = workerData
  try {
    const response = await apiClient.patch(`/api/v1/worker/${id}`, rest)
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        worker: response.data.worker
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating worker:', error)
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

export const deleteWorker: DeleteWorker = async (workerId) => {
  try {
    const response = await apiClient.delete(`/api/v1/worker/${workerId}`)
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        worker: response.data.worker
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error deleting worker:', error)
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

export const updateWorkerStatus: UpdateWorkerStatus = async (workerId, isActive) => {
  // /api/v1/worker/cmfo1wq2m0004qbge1zr26fge/status
  try {
    const response = await apiClient.patch(`/api/v1/worker/${workerId}/status`, { isActive })
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        worker: response.data.worker
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating worker status:', error)
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

export const getWeeksByCursor: GetWeeksByCursor = async ({ workplaceId, take, cursor, search }) => {
  try {
    const result = await apiClient.get(
      `/api/v1/worker/week/cursor/${workplaceId}?take=${take}&cursor=${cursor}&search=${search}`
    )
    return result.data
  } catch (error: any) {
    console.error('Error fetching weeks by cursor:', error)
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

export const createWeek: CreateWeek = async (createWeekData) => {
  try {
    const response = await apiClient.post('/api/v1/worker/week/create', { ...createWeekData })
    if (response.status === 201) {
      return {
        status: 'success',
        message: response.data.message,
        week: response.data.week
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (err: any) {
    console.error('Error creating week:', err)
    const { status, data } = err.response
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

export const updateWeek: UpdateWeek = async (weekData) => {
  const { weekId, weekStart } = weekData
  try {
    const response = await apiClient.put(`/api/v1/worker/week/${weekId}`, { weekStart })
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        week: response.data.week
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating week:', error)
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

export const deleteWeek: DeleteWeek = async ({ weekId, workplaceId }) => {
  try {
    const response = await apiClient.delete(`/api/v1/worker/week/${weekId}/${workplaceId}`)
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        week: response.data.week,
        nextWeekId: response.data.nextWeekId
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error deleting week:', error)
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

export const getWeekRecords: GetWeekRecords = async ({ weekId, workplaceId }) => {
  try {
    const response = await apiClient.get(`/api/v1/worker/week-record/${weekId}/${workplaceId}`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching week records:', error)
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

export const updateWeekRecord: UpdateWeekRecord = async (recordData) => {
  const { id, ...rest } = recordData
  try {
    const response = await apiClient.patch(`/api/v1/worker/week-record/update/${id}`, rest)
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        record: response.data.record
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating week record:', error)
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

export const updateWeekRecordPayment: UpdateWeekRecordPayment = async (recordData) => {
  try {
    const response = await apiClient.patch(
      `/api/v1/worker/week-record/payment/${recordData.type}/${recordData.recordId}`
    )
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        record: response.data.record
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error updating week record:', error)
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

export const createWeekRecord: CreateWeekRecord = async ({ weekId, workerId }) => {
  try {
    const response = await apiClient.post(`/api/v1/worker/week-record/create`, { weekId, workerId })
    if (response.status === 201) {
      return {
        status: 'success',
        message: response.data.message,
        record: response.data.record
      }
    }

    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (err: any) {
    console.error('Error creating week record:', err)
    const { status, data } = err.response
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

export const deleteWeekRecord: DeleteWeekRecord = async (recordId) => {
  try {
    const response = await apiClient.delete(`/api/v1/worker/week-record/delete/${recordId}`)
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        record: response.data.record
      }
    }
    return {
      status: 'failed',
      message: 'Unexpected response from server.'
    }
  } catch (error: any) {
    console.error('Error deleting record:', error)
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

export const getYearSummary: GetYearSummary = async ({ year, workplaceId }) => {
  try {
    const response = await apiClient.get(`/api/v1/worker/year-record/${year}/${workplaceId}`)
    if (response.status === 200) {
      return {
        status: 'success',
        message: response.data.message,
        nextYear: response.data.nextYear,
        prevYear: response.data.prevYear,
        records: response.data.records
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

export const getYearsByCursor: GetYearByCursor = async ({ take, cursor, search, workplaceId }) => {
  try {
    const result = await apiClient.get(
      `/api/v1/worker/year/cursor/${workplaceId}?take=${take}&cursor=${cursor}&search=${search}`
    )
    return result.data
  } catch (error: any) {
    console.error('Error fetching year by cursor:', error)
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

export const getSummaryWorkers: GetSummaryWorkers = async ({ workplaceId, weekId }) => {
  try {
    const result = await apiClient.get(`/api/v1/worker/summary/${workplaceId}/${weekId}`)
    return result.data
  } catch (error: any) {
    console.error('Error fetching summary:', error)
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

export const getWorkerRecords: GetWorkerRecords = async ({ limit, page, workerId }) => {
  try {
    const result = await apiClient.get(
      `/api/v1/worker/week-workplace/${workerId}?limit=${limit}&page=${page}`
    )
    return result.data
  } catch (error: any) {
    console.error('Error fetching worker records:', error)
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

export const getSummaryWorker: GetSummaryWorker = async (workerId) => {
  try {
    const result = await apiClient.get(`/api/v1/worker/summary-worker/${workerId}`)
    return result.data
  } catch (error: any) {
    console.error('Error fetching summary:', error)
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
