export const productService = {
  fetchProducts: async (getProductData: GetProductsParams) => {
    try {
      const result = await window.context.getProducts(getProductData)
      console.log('Fetched clients:', result)
      return result
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  },
  createProduct: async (productData: CreateProductInput, seasonId: string) => {
    try {
      const result = await window.context.createProduct(productData, seasonId)
      return result
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },
  updateProduct: async (productData: UpdateProductInput, seasonId: string) => {
    try {
      const result = await window.context.updateProduct(productData, seasonId)
      return result
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },
  deleteProduct: async (productId: string, seasonId: string) => {
    try {
      const result = await window.context.deleteProduct(productId, seasonId)
      return result
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },
  getAllProductsStatus: async (seasonId: string) => {
    try {
      const result = await window.context.getAllProductsStatus(seasonId)
      return result
    } catch (error) {
      console.error('Error getting all products status:', error)
      throw error
    }
  }
}
