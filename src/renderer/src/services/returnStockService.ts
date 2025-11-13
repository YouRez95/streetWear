export const returnStockService = {
  fetchReturnStock: async (getReturnStockData: GetReturnStockParams) => {
    try {
      const result = await window.context.getReturnStock(getReturnStockData)
      //console.log('Fetched return stock:', result)
      return result
    } catch (error) {
      console.error('Error fetching return stock:', error)
      throw error
    }
  },

  deleteClientReturnStock: async (clientReturnId: string, seasonId: string) => {
    try {
      const result = await window.context.deleteClientReturnStock(clientReturnId, seasonId)
      //console.log('Deleted client return stock:', result)
      return result
    } catch (error) {
      console.error('Error deleting client return stock:', error)
      throw error
    }
  },

  deleteReturnStock: async (seasonId: string, stockReturnId: string) => {
    try {
      const result = await window.context.deleteReturnStock(seasonId, stockReturnId)
      return result
    } catch (error) {
      console.error('Error deleting client return stock:', error)
      throw error
    }
  },

  updateClientReturnStock: async (updateOrderClientData: UpdateClientReturnStockInput) => {
    try {
      const result = await window.context.updateClientReturnStock(updateOrderClientData)
      return result
    } catch (error) {
      console.error('Error updating client return stock:', error)
      throw error
    }
  },
  getSummaryReturnStock: async (seasonId: string) => {
    try {
      const result = await window.context.getSummaryReturnStock(seasonId)
      //console.log('Fetched summary return stock:', result)
      return result
    } catch (error) {
      console.error('Error fetching summary return stock:', error)
      throw error
    }
  },

  createOrderClientFromReturnStock: async (orderClientData: CreateOrderClientInput) => {
    try {
      const result = await window.context.createOrderClientFromReturnStock(orderClientData)
      //console.log('Created order client from return stock:', result)
      return result
    } catch (error) {
      console.error('Error creating order client from return stock:', error)
      throw error
    }
  }
}
