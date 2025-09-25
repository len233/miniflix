// Lancement du site (chargement initial + écouteurs globaux)
fetchMovies("/movie/popular", "topMoviesRow", 3);
fetchMovies("/discover/movie?with_genres=28", "actionMoviesRow", 3);
fetchMovies("/discover/movie?with_genres=35,10749", "comedyMoviesRow", 3);
fetchMovies("/discover/movie?with_genres=878", "scifiMoviesRow", 3);

document.getElementById('movieModal').addEventListener('click', e=>{ 
  if(e.target.id==='movieModal') closeModal(); 
});

document.addEventListener('keydown', e=>{ 
  if(e.key==='Escape') closeModal(); 
});
