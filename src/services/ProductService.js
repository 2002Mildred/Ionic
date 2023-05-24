
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:44331/api/v1/catalog', 
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getProducts() {
    return apiClient.get('/')
  },
  getProduct(id) {
    return apiClient.get('/' + id)
  },
  getProductsByCategory(category) {
    return apiClient.get('/GetProductyByCategoria/' + category)
  },
  createProduct(product) {
    return apiClient.post('/', product)
  },
  updateProduct(product) {
    return apiClient.put('/', product)
  },
  deleteProduct(id) {
    return apiClient.delete('/' + id)
  }
}
