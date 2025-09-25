// Chargement des films depuis l'API
async function fetchMovies(endpoint, rowId, pages = 3) {
  try {
    let allResults = [];
    for (let page = 1; page <= pages; page++) {
      const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${page}&language=fr-FR`;
      const res = await fetch(url, options);
      const data = await res.json();
      if (Array.isArray(data.results)) {
        allResults = allResults.concat(data.results);
      }
    }
    addMoviesToRow(allResults, rowId);
  } catch (e) {
    console.error(e);
    document.getElementById(rowId).innerHTML = '<p>Erreur lors du chargement des films</p>';
  }
}

function addMoviesToRow(moviesList,rowId){
  const row=document.getElementById(rowId);
  row.innerHTML='';
  moviesList.forEach(movie=>{
    allMovies[movie.id]=movie;
    const isFavorite=favorites.includes(movie.id);
    const card=document.createElement('div'); card.className='movie-card';
    card.innerHTML=`<img src="${movie.poster_path?IMAGE_BASE_URL+movie.poster_path:'https://via.placeholder.com/300x450?text=Image+non+disponible'}" alt="${movie.title}" loading="lazy">
      <button class="favorite-btn ${isFavorite?'active':''}" onclick="toggleFavorite(${movie.id}, event)">
        <i class="fas fa-heart"></i>
      </button>
      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-meta">
          <span>⭐ ${movie.vote_average?movie.vote_average.toFixed(1):"N/A"}</span>
          <span>${(movie.release_date||"").split("-")[0]}</span>
        </div>
      </div>`;
    card.addEventListener('click', e=>{ if(!e.target.closest('.favorite-btn')) showModal(movie.id); });
    row.appendChild(card);
  });
}
