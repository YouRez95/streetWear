export const stylistService = {
  createStylist: async (stylistData: CreateStylistInput) => {
    try {
      const result = await window.context.createStylist(stylistData)
      //console.log('Create stylist result:', result)
      return result
    } catch (error) {
      console.error('Error creating stylist:', error)
      throw error
    }
  },
  getStylists: async (types: string[], page: number, limit: number, searchTerm: string) => {
    //console.log('Types:', types)
    try {
      const result = await window.context.getStylists(types, page, limit, searchTerm)
      return result
    } catch (error) {
      console.error('Error fetching stylists:', error)
      throw error
    }
  },
  updateStylistStatus: async (stylistIdAndStatus: { stylistId: string; status: boolean }) => {
    try {
      const result = await window.context.updateStylistStatus(
        stylistIdAndStatus.stylistId,
        stylistIdAndStatus.status
      )
      return result
    } catch (error) {
      console.error('Error updating stylist status:', error)
      throw error
    }
  },
  updateStylist: async (stylistData: UpdateStylistInput) => {
    try {
      const result = await window.context.updateStylist(stylistData)
      return result
    } catch (error) {
      console.error('Error updating stylist:', error)
      throw error
    }
  },
  deleteStylist: async (stylistId: string) => {
    try {
      const result = await window.context.deleteStylist(stylistId)
      return result
    } catch (error) {
      console.error('Error deleting stylist:', error)
      throw error
    }
  },
  getActiveStylists: async (seasonId: string, openBon: boolean, closedBon: boolean) => {
    try {
      const result = await window.context.getActiveStylists(seasonId, openBon, closedBon)
      return result
    } catch (error) {
      console.error('Error fetching active stylists:', error)
      throw error
    }
  },
  createBonStylist: async (bonData: CreateBonStylistInput) => {
    try {
      const result = await window.context.createBonStylist(bonData)
      return result
    } catch (error) {
      console.error('Error creating bon stylist:', error)
      throw error
    }
  },
  createOrderStylist: async (orderData: CreateOrderStylistInput) => {
    try {
      const result = await window.context.createOrderStylist(orderData)
      return result
    } catch (error) {
      console.error('Error creating order stylist:', error)
      throw error
    }
  },
  createAvanceStylist: async (avanceData: CreateAvanceStylistInput) => {
    try {
      const result = await window.context.createAvanceStylist(avanceData)
      return result
    } catch (error) {
      console.error('Error creating avance stylist:', error)
      throw error
    }
  },
  getOrdersStylist: async (
    seasonId: string,
    stylistId: string,
    bonId: string,
    queryParams?: QueryParams
  ) => {
    try {
      const result = await window.context.getOrdersStylist(seasonId, stylistId, bonId, queryParams)
      return result
    } catch (error) {
      console.error('Error fetching orders stylist:', error)
      throw error
    }
  },
  updateOrderStylist: async (updateOrderStylistData: UpdateOrderStylistInput) => {
    try {
      const result = await window.context.updateOrderStylist(updateOrderStylistData)
      return result
    } catch (error) {
      console.error('Error updating order stylist:', error)
      throw error
    }
  },
  deleteOrderStylist: async (orderId: string, seasonId: string) => {
    try {
      const result = await window.context.deleteOrderStylist(orderId, seasonId)
      return result
    } catch (error) {
      console.error('Error deleting order stylist:', error)
      throw error
    }
  },
  deleteAvanceStylist: async (avanceId: string, seasonId: string) => {
    try {
      const result = await window.context.deleteAvanceStylist(avanceId, seasonId)
      return result
    } catch (error) {
      console.error('Error deleting avance stylist:', error)
      throw error
    }
  },
  toggleBonStylist: async (
    bonId: string,
    seasonId: string,
    openBon: boolean,
    closeBon: boolean
  ) => {
    try {
      const result = await window.context.toggleBonStylist(bonId, seasonId, openBon, closeBon)
      return result
    } catch (error) {
      console.error('Error toggling bon stylist:', error)
      throw error
    }
  },
  deleteBonStylist: async (bonId: string, seasonId: string) => {
    try {
      const result = await window.context.deleteBonStylist(bonId, seasonId)
      return result
    } catch (error) {
      console.error('Error deleting bon stylist:', error)
      throw error
    }
  },
  getStylistSummary: async (seasonId: string, stylistId: string, bonId: string) => {
    try {
      const result = await window.context.getStylistSummary(seasonId, stylistId, bonId)
      return result
    } catch (error) {
      console.error('Error fetching stylist summary:', error)
      throw error
    }
  }
}
