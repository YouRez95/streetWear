export const dashboardService = {
  getGeneralSettings: async () => {
    try {
      return await window.context.getGeneralSettings()
    } catch (error) {
      console.error('Error fetching general settings:', error)
      throw error
    }
  },
  getSummary: async (seasonId: string) => {
    try {
      return await window.context.getSummary(seasonId)
    } catch (error) {
      console.error('Error fetching summary:', error)
      throw error
    }
  },
  getRetardOrdersFaconnier: async (seasonId: string) => {
    try {
      return await window.context.getRetardOrdersFaconnier(seasonId)
    } catch (error) {
      console.error('Error fetching retard orders façonnier:', error)
      throw error
    }
  }
}
