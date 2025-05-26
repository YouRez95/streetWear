export const seasonService = {
  fetchSeasons: async (page: number, limit: number, search: string) => {
    try {
      const result = await window.context.getSeasons(page, limit, search)
      console.log('Fetched seasons:', result)
      return result
    } catch (error) {
      console.error('Error fetching seasons:', error)
      throw error
    }
  },

  createSeason: async (seasonData: CreateSeasonInput) => {
    try {
      const result = await window.context.createSeason(seasonData)
      console.log('Created season:', result)
      return result
    } catch (error) {
      console.error('Error creating season:', error)
      throw error
    }
  },

  updateSeason: async (seasonData: UpdateSeasonInput) => {
    try {
      const result = await window.context.updateSeason(seasonData)
      console.log('Updated season:', result)
      return result
    } catch (error) {
      console.error('Error updating season:', error)
      throw error
    }
  },

  deleteSeason: async (seasonId: string) => {
    try {
      const result = await window.context.deleteSeason(seasonId)
      console.log('Deleted season:', result)
      return result
    } catch (error) {
      console.error('Error deleting season:', error)
      throw error
    }
  }
}
