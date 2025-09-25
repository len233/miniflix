// Chargement des films depuis l'API
async function fetchMovies(endpoint, rowId, pages = 3) { // Par défaut, charge 3 pages
  try {
    let allResults = [];
    // Boucle pour charger plusieurs pages
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

// Ajoute les films à une ligne spécifique 
function addMoviesToRow(moviesList,rowId){
  const row=document.getElementById(rowId);
  row.innerHTML='';
  moviesList.forEach(movie=>{
    allMovies[movie.id]=movie; // Met à jour le cache global
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
    card.addEventListener('click', e=>{ if(!e.target.closest('.favorite-btn')) showModal(movie.id); }); // Ouvre la modale sauf si le clic est sur le bouton favori
    row.appendChild(card);
  });
}

// Notification d'un nouveau film 
function notifyNewMovie(movie) {
  if (typeof showNotification === 'function') {
    showNotification(`Nouveau film disponible : ${movie.title}`, 'info');
  }
}
