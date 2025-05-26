export const dashboardService = {
  getGeneralSettings: async () => {
    try {
      return await window.context.getGeneralSettings()
    } catch (error) {
      console.error('Error fetching general settings:', error)
      throw error
    }
  }
}
