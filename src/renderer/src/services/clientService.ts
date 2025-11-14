export const clientService = {
  fetchClients: async (page: number, limit: number, search: string) => {
    try {
      const result = await window.context.getClients(page, limit, search)
      //console.log('Fetched clients:', result)
      return result
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  },

  createClient: async (clientData: CreateClientInput) => {
    try {
      return await window.context.createClient(clientData)
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  },

  deleteClient: async (clientId: string) => {
    try {
      return await window.context.deleteClient(clientId)
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  },

  updateClient: async (clientData: UpdateClientInput) => {
    try {
      return await window.context.updateClient(clientData)
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  },

  updateClientStatus: async (clientIdAndStatus: { clientId: string; status: boolean }) => {
    try {
      return await window.context.updateClientStatus(
        clientIdAndStatus.clientId,
        clientIdAndStatus.status
      )
    } catch (error) {
      console.error('Error updating client status:', error)
      throw error
    }
  },

  getActiveClients: async (seasonId: string, openBon: boolean, closedBon: boolean) => {
    try {
      return await window.context.getActiveClients(seasonId, openBon, closedBon)
    } catch (error) {
      console.error('Error fetching active clients:', error)
      throw error
    }
  },

  getActiveClientsAndPassager: async (seasonId: string, openBon: boolean, closedBon: boolean) => {
    try {
      return await window.context.getActiveClientsAndPassager(seasonId, openBon, closedBon)
    } catch (error) {
      console.error('Error fetching active clients:', error)
      throw error
    }
  },

  createBonClient: async (bonData: CreateBonClientInput) => {
    try {
      return await window.context.createBonClient(bonData)
    } catch (error) {
      console.error('Error creating bon client:', error)
      throw error
    }
  },

  getBonsClientPassager: async (seasonId: string) => {
    try {
      return await window.context.getBonsClientPassager(seasonId)
    } catch (error) {
      console.error('Error get bon for client passager:', error)
      throw error
    }
  },

  createBonClientPassager: async (bonData: CreateBonClientPassagerInput) => {
    try {
      return await window.context.createBonClientPassager(bonData)
    } catch (error) {
      console.error('Error creating bon client:', error)
      throw error
    }
  },

  createOrderClient: async (orderData: CreateOrderClientInput) => {
    try {
      return await window.context.createOrderClient(orderData)
    } catch (error) {
      console.error('Error creating order client:', error)
      throw error
    }
  },

  createMultipleOrdersClient: async (
    ordersData: CreateMultipleOrdersClientInput & { seasonId: string }
  ) => {
    try {
      return await window.context.createMultipleOrdersClient(ordersData)
    } catch (error) {
      console.error('Error creating multiple orders client:', error)
      throw error
    }
  },

  getOrdersClient: async (
    seasonId: string,
    clientId: string,
    bonId: string,
    queryParams: QueryParams
  ) => {
    try {
      return await window.context.getOrdersClient(seasonId, clientId, bonId, queryParams)
    } catch (error) {
      console.error('Error fetching orders client:', error)
      throw error
    }
  },
  createAvanceClient: async (avanceData: CreateAvanceClientInput) => {
    try {
      return await window.context.createAvanceClient(avanceData)
    } catch (error) {
      console.error('Error creating avance client:', error)
      throw error
    }
  },
  getClientSummary: async (seasonId: string, clientId: string, bonId: string) => {
    try {
      return await window.context.getClientSummary(seasonId, clientId, bonId)
    } catch (error) {
      console.error('Error fetching client summary:', error)
      throw error
    }
  },
  deleteBonClient: async (bonId: string, seasonId: string) => {
    try {
      return await window.context.deleteBonClient(bonId, seasonId)
    } catch (error) {
      console.error('Error deleting bon client:', error)
      throw error
    }
  },
  deleteOrderClient: async (orderId: string, seasonId: string) => {
    try {
      return await window.context.deleteOrderClient(orderId, seasonId)
    } catch (error) {
      console.error('Error deleting order client:', error)
      throw error
    }
  },
  deleteAvanceClient: async (avanceId: string, seasonId: string) => {
    try {
      return await window.context.deleteAvanceClient(avanceId, seasonId)
    } catch (error) {
      console.error('Error deleting avance client:', error)
      throw error
    }
  },
  toggleBonClient: async (toggleData: ToggleBonClientInput) => {
    const { bonId, seasonId, openBon, closeBon, remise } = toggleData
    try {
      return await window.context.toggleBonClient(toggleData)
    } catch (error) {
      console.error('Error toggling bon client:', error)
      throw error
    }
  },
  updateOrderClient: async (updateOrderClientData: UpdateOrderClientInput) => {
    try {
      return await window.context.updateOrderClient(updateOrderClientData)
    } catch (error) {
      console.error('Error updating order client:', error)
      throw error
    }
  }
}
