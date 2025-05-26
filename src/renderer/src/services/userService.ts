export const userService = {
  fetchUsers: async (page: number, limit: number, search: string) => {
    try {
      const result = await window.context.getUsers(page, limit, search)
      console.log('Fetched users:', result)
      return result
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  createUser: async (userData: CreateUserInput) => {
    try {
      return await window.context.createUser(userData)
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  deleteUser: async (userId: string) => {
    try {
      return await window.context.deleteUser(userId)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  updateUser: async (userData: UpdateUserInput) => {
    try {
      return await window.context.updateUser(userData)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }
}
