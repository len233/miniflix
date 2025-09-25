// Configuration et variables globales
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const options = { 
  method: "GET", 
  headers: { 
    accept: "application/json", 
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNGI5MDMyNzIyN2M4OGRhYWMxNGMwYmQwYzFmOTNjZCIsIm5iZiI6MTc1ODY0ODMyMS43NDg5OTk4LCJzdWIiOiI2OGQyZDgwMTJhNWU3YzBhNDVjZWNmZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.aylEitwtAH0w4XRk8izJNNkF_bet8sxiC9iI-zSdHbU"
  }
};

let allMovies = {};
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentTheme = 'dark'; // 'dark', 'light', 'sepia'
