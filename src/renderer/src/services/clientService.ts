export const clientService = {
  fetchClients: async (page: number, limit: number, search: string) => {
    try {
      const result = await window.context.getClients(page, limit, search)
      console.log('Fetched clients:', result)
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
  }
}
