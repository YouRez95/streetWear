export const workersService = {
  createWorkPlace: async (workPlaceData: Omit<CreateWorkPlaceInput, 'id'>) => {
    try {
      const result = await window.context.createWorkPlace(workPlaceData)
      return result
    } catch (error) {
      console.error('Error creating workplace:', error)
      throw error
    }
  },

  getWorkPlaces: async ({
    page,
    limit,
    search
  }: {
    page: number
    limit: number
    search: string
  }) => {
    try {
      const workPlaces = await window.context.getWorkPlaces(page, limit, search)
      return workPlaces
    } catch (error) {
      console.error('Error fetching workplaces:', error)
      throw error
    }
  },

  getWorkPlacesByCursor: async ({
    take,
    cursor,
    search
  }: {
    take: number
    cursor: string
    search: string
  }) => {
    try {
      const workPlaces = await window.context.getWorkplacesByCursor({ cursor, search, take })
      return workPlaces
    } catch (error) {
      console.error('Error fetching workplaces:', error)
      throw error
    }
  },

  updateWorkPlace: async (workplaceData: CreateWorkPlaceInput) => {
    try {
      const updatedWorkPlace = await window.context.updateWorkplace(workplaceData)
      return updatedWorkPlace
    } catch (error) {
      console.error('Error updating workplace:', error)
      throw error
    }
  },

  deleteWorkPlace: async (workplaceId: string) => {
    try {
      const deletedWorkPlace = await window.context.deleteWorkplace(workplaceId)
      return deletedWorkPlace
    } catch (error) {
      console.error('Error deleting workplace:', error)
      throw error
    }
  },

  createWorker: async (workerData: CreateWorkerInput) => {
    try {
      const result = await window.context.createWorker(workerData)
      return result
    } catch (error) {
      console.error('Error creating worker:', error)
      throw error
    }
  },

  getWorkers: async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
    try {
      const workers = await window.context.getWorkers(page, limit, search)
      return workers
    } catch (error) {
      console.error('Error fetching workers:', error)
      throw error
    }
  },

  updateWorker: async (workerData: UpdateWorkerInput) => {
    try {
      const updatedWorker = await window.context.updateWorker(workerData)
      return updatedWorker
    } catch (error) {
      console.error('Error updating worker:', error)
      throw error
    }
  },

  deleteWorker: async (workerId: string) => {
    try {
      const deletedWorker = await window.context.deleteWorker(workerId)
      return deletedWorker
    } catch (error) {
      console.error('Error deleting worker:', error)
      throw error
    }
  },

  getWorkersByCursor: async ({
    take,
    cursor,
    search
  }: {
    take: number
    cursor: string
    search: string
  }) => {
    try {
      const workers = await window.context.getWorkersCursor({ cursor, search, take })
      return workers
    } catch (error) {
      console.error('Error fetching workers:', error)
      throw error
    }
  },

  updateWorkerStatus: async ({ workerId, status }: { workerId: string; status: boolean }) => {
    try {
      const isActive = status
      const updatedWorker = await window.context.updateWorkerStatus(workerId, isActive)
      return updatedWorker
    } catch (error) {
      console.error('Error updating worker status:', error)
      throw error
    }
  },

  getWeeksByCursor: async ({
    workplaceId,
    take,
    cursor,
    search
  }: {
    workplaceId: string
    take: number
    cursor: string
    search: string
  }) => {
    try {
      const weeks = await window.context.getWeeksByCursor({ workplaceId, cursor, search, take })
      return weeks
    } catch (error) {
      console.error('Error fetching weeks:', error)
      throw error
    }
  },

  createWeek: async ({ weekStart, workplaceId }: { weekStart: string; workplaceId: string }) => {
    try {
      const result = await window.context.createWeek({ weekStart, workplaceId })
      return result
    } catch (error) {
      console.error('Error creating week:', error)
      throw error
    }
  },

  updateWeek: async ({ weekId, weekStart }: { weekStart: string; weekId: string }) => {
    try {
      const result = await window.context.updateWeek({ weekId, weekStart })
      return result
    } catch (error) {
      console.error('Error updating week:', error)
      throw error
    }
  },

  deleteWeek: async ({ weekId, workplaceId }: { weekId: string; workplaceId: string }) => {
    try {
      const result = await window.context.deleteWeek({ weekId, workplaceId })
      return result
    } catch (error) {
      console.error('Error deleting week:', error)
      throw error
    }
  },

  getWeekRecords: async ({ weekId, workplaceId }: GetWeeksRecordsInput) => {
    try {
      const weekRecords = await window.context.getWeekRecords({ weekId, workplaceId })
      return weekRecords
    } catch (error) {
      console.error('Error fetching week records:', error)
      throw error
    }
  },

  updateWeekRecord: async (recordData: UpdateWeekRecordInput) => {
    try {
      const updatedRecord = await window.context.updateWeekRecord(recordData)
      return updatedRecord
    } catch (error) {
      console.error('Error updating week record:', error)
      throw error
    }
  },

  updateWeekRecordPayment: async (recordData: UpdateWeekRecordPaymentInput) => {
    try {
      const updatedRecord = await window.context.updateWeekRecordPayment(recordData)
      return updatedRecord
    } catch (error) {
      console.error('Error updating week record:', error)
      throw error
    }
  },

  deleteWeekRecord: async (recordId: string) => {
    try {
      const deletedRecord = await window.context.deleteWeekRecord(recordId)
      return deletedRecord
    } catch (error) {
      console.error('Error deleting week record:', error)
      throw error
    }
  },

  createWeekRecord: async ({ weekId, workerId }: { weekId: string; workerId: string }) => {
    try {
      const createdRecord = await window.context.createWeekRecord({ weekId, workerId })
      return createdRecord
    } catch (error) {
      console.error('Error creating week record:', error)
      throw error
    }
  },

  getYearSummary: async ({ workplaceId, year }: GetYearSummaryInput) => {
    try {
      const result = await window.context.getYearSummary({ year, workplaceId })
      return result
    } catch (error) {
      console.log('error get year summary worker')
      throw error
    }
  },

  getYearsByCursor: async ({
    workplaceId,
    take,
    cursor,
    search
  }: {
    workplaceId: string
    take: number
    cursor: string
    search: string
  }) => {
    try {
      const years = await window.context.getYearsByCursor({ cursor, search, take, workplaceId })
      return years
    } catch (error) {
      console.error('Error fetching years:', error)
      throw error
    }
  },

  getSummaryWorkers: async ({ workplaceId, weekId }: { workplaceId: string; weekId: string }) => {
    try {
      const summaryWorkers = await window.context.getSummaryWorkers({ workplaceId, weekId })
      return summaryWorkers
    } catch (error) {
      console.error('Error fetching summary workers:', error)
      throw error
    }
  },

  getSummaryWorker: async (workerId: string) => {
    try {
      const summaryWorker = await window.context.getSummaryWorker(workerId)
      return summaryWorker
    } catch (error) {
      console.error('Error fetching summary worker:', error)
      throw error
    }
  },

  getWorkerRecords: async ({
    limit,
    page,
    workerId
  }: {
    workerId: string
    page: number
    limit: number
  }) => {
    try {
      const workerRecords = await window.context.getWorkerRecords({ workerId, page, limit })
      return workerRecords
    } catch (error) {
      console.error('Error fetching worker records:', error)
      throw error
    }
  }
}
