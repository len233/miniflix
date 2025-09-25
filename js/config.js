// Configuration et variables globales
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const CACHE_DURATION = 30 * 60 * 1000; 
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; 

const options = { 
  method: "GET", 
  headers: { 
    accept: "application/json", 
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNGI5MDMyNzIyN2M4OGRhYWMxNGMwYmQwYzFmOTNjZCIsIm5iZiI6MTc1ODY0ODMyMS43NDg5OTk4LCJzdWIiOiI2OGQyZDgwMTJhNWU3YzBhNDVjZWNmZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.aylEitwtAH0w4XRk8izJNNkF_bet8sxiC9iI-zSdHbU"
  }
};

// Cache et état global
let allMovies = {};
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentTheme = 'dark'; 
let cache = new Map();

// Gestion du cache
const getCacheKey = (url) => `cache_${url}`;
const setCacheItem = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Récupère un élément du cache s'il est encore valide
const getCacheItem = (key) => {
  const item = cache.get(key);
  if (!item) return null; 
  // Vérifie la validité du cache
  if (Date.now() - item.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return item.data;
};

// Gestion des erreurs et retries
async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  try {
    const cacheKey = getCacheKey(url);
    const cachedData = getCacheItem(cacheKey);
    if (cachedData) return cachedData;

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setCacheItem(cacheKey, data);
    return data;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}
