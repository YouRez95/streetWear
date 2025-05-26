export const faconnierService = {
  fetchFaconniers: async (page: number, limit: number, search: string) => {
    try {
      const result = await window.context.getFaconniers(page, limit, search)
      console.log('Fetched faconniers:', result)
      return result
    } catch (error) {
      console.error('Error fetching faconniers:', error)
      throw error
    }
  },

  createFaconnier: async (faconnierData: CreateFaconnierInput) => {
    try {
      return await window.context.createFaconnier(faconnierData)
    } catch (error) {
      console.error('Error creating faconnier:', error)
      throw error
    }
  },

  deleteFaconnier: async (faconnierId: string) => {
    try {
      return await window.context.deleteFaconnier(faconnierId)
    } catch (error) {
      console.error('Error deleting faconnier:', error)
      throw error
    }
  },

  updateFaconnier: async (faconnierData: UpdateFaconnierInput) => {
    try {
      return await window.context.updateFaconnier(faconnierData)
    } catch (error) {
      console.error('Error updating faconnier:', error)
      throw error
    }
  },
  updateFaconnierStatus: async (faconnierIdAndStatus: { faconnierId: string; status: boolean }) => {
    try {
      return await window.context.updateFaconnierStatus(
        faconnierIdAndStatus.faconnierId,
        faconnierIdAndStatus.status
      )
    } catch (error) {
      console.error('Error updating faconnier status:', error)
      throw error
    }
  },
  getActiveFaconniers: async (seasonId: string, openBon: boolean, closedBon: boolean) => {
    try {
      return await window.context.getActiveFaconniers(seasonId, openBon, closedBon)
    } catch (error) {
      console.error('Error fetching active faconniers:', error)
      throw error
    }
  },
  createBonFaconnier: async (bonData: CreateBonFaconnierInput) => {
    try {
      return await window.context.createBonFaconnier(bonData)
    } catch (error) {
      console.error('Error creating bon faconnier:', error)
      throw error
    }
  },
  createOrderFaconnier: async (orderData: CreateOrderFaconnierInput) => {
    try {
      return await window.context.createOrderFaconnier(orderData)
    } catch (error) {
      console.error('Error creating order faconnier:', error)
      throw error
    }
  },
  getOrdersFaconnier: async (seasonId: string, faconnierId: string, bonId: string) => {
    try {
      return await window.context.getOrdersFaconnier(seasonId, faconnierId, bonId)
    } catch (error) {
      console.error('Error fetching orders faconnier:', error)
      throw error
    }
  },
  createAvanceFaconnier: async (avanceData: CreateAvanceFaconnierInput) => {
    try {
      return await window.context.createAvanceFaconnier(avanceData)
    } catch (error) {
      console.error('Error creating avance faconnier:', error)
      throw error
    }
  },
  getFaconnierSummary: async (seasonId: string, faconnierId: string, bonId: string) => {
    try {
      return await window.context.getFaconnierSummary(seasonId, faconnierId, bonId)
    } catch (error) {
      console.error('Error fetching faconnier summary:', error)
      throw error
    }
  },
  updateOrderQuantityReturned: async (orderId: string, quantityReturned: number) => {
    try {
      return await window.context.updateOrderQuantityReturned(orderId, quantityReturned)
    } catch (error) {
      console.error('Error updating order quantity returned:', error)
      throw error
    }
  },
  deleteAvanceFaconnier: async (avanceId: string) => {
    try {
      return await window.context.deleteAvanceFaconnier(avanceId)
    } catch (error) {
      console.error('Error deleting avance faconnier:', error)
      throw error
    }
  },
  deleteOrderFaconnier: async (orderId: string) => {
    try {
      return await window.context.deleteOrderFaconnier(orderId)
    } catch (error) {
      console.error('Error deleting order faconnier:', error)
      throw error
    }
  },
  toggleBonFaconnier: async (bonId: string, openBon: boolean, closeBon: boolean) => {
    try {
      return await window.context.toggleBonFaconnier(bonId, openBon, closeBon)
    } catch (error) {
      console.error('Error toggling bon faconnier:', error)
      throw error
    }
  },
  deleteBonFaconnier: async (bonId: string) => {
    try {
      return await window.context.deleteBonFaconnier(bonId)
    } catch (error) {
      console.error('Error deleting bon faconnier:', error)
      throw error
    }
  }
}
