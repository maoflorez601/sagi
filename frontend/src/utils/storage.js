import { sampleProducts, productsStorageKey } from '../data/mockProducts.js';
import { sampleRequests, requestsStorageKey } from '../data/mockRequests.js';

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const getStoredProducts = () => {
  try {
    const storedProducts = JSON.parse(localStorage.getItem(productsStorageKey) || '[]');
    return Array.isArray(storedProducts) && storedProducts.length > 0 ? storedProducts : sampleProducts;
  } catch {
    return sampleProducts;
  }
};

export const saveStoredProducts = (products) => {
  localStorage.setItem(productsStorageKey, JSON.stringify(products));
};

export const getStoredRequests = () => {
  try {
    const storedRequests = JSON.parse(localStorage.getItem(requestsStorageKey) || '[]');
    return Array.isArray(storedRequests) && storedRequests.length > 0 ? storedRequests : sampleRequests;
  } catch {
    return sampleRequests;
  }
};

export const saveStoredRequests = (requests) => {
  localStorage.setItem(requestsStorageKey, JSON.stringify(requests));
};
