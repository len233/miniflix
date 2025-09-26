function fetchCategory({endpoint, rowId, nbPages = 3, max = null, pageVar, moviesVar}) {
  window[pageVar] = window[pageVar] || 1;
  window[moviesVar] = window[moviesVar] || [];
  (async () => {
    for (let page = window[pageVar]; page < window[pageVar] + nbPages; page++) {
      const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${page}&language=fr-FR`;
      const res = await fetch(url, options);
      const data = await res.json();
      if (Array.isArray(data.results)) window[moviesVar] = window[moviesVar].concat(data.results);
    }
    window[pageVar] += nbPages;
    addMoviesToRow(max ? window[moviesVar].slice(0, max) : window[moviesVar], rowId);
  })();
}

fetchCategory({endpoint: '/movie/popular', rowId: 'topMoviesRow', nbPages: 3, max: 10, pageVar: 'topPage', moviesVar: 'topMovies'});

function loadMoreAction() { fetchCategory({endpoint: '/discover/movie?with_genres=28', rowId: 'actionMoviesRow', nbPages: 1, pageVar: 'actionPage', moviesVar: 'actionMovies'}); }
fetchCategory({endpoint: '/discover/movie?with_genres=28', rowId: 'actionMoviesRow', nbPages: 3, pageVar: 'actionPage', moviesVar: 'actionMovies'});


function loadMoreComedy() { fetchCategory({endpoint: '/discover/movie?with_genres=35,10749', rowId: 'comedyMoviesRow', nbPages: 1, pageVar: 'comedyPage', moviesVar: 'comedyMovies'}); }
fetchCategory({endpoint: '/discover/movie?with_genres=35,10749', rowId: 'comedyMoviesRow', nbPages: 3, pageVar: 'comedyPage', moviesVar: 'comedyMovies'});


function loadMoreScifi() { 
  fetchCategory({endpoint: '/discover/movie?with_genres=878', rowId: 'scifiMoviesRow', nbPages: 1, pageVar: 'scifiPage', moviesVar: 'scifiMovies'}); 
}
fetchCategory({endpoint: '/discover/movie?with_genres=878', rowId: 'scifiMoviesRow', nbPages: 3, pageVar: 'scifiPage', moviesVar: 'scifiMovies'});

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

// Ajoute les films à une ligne spécifique 
function addMoviesToRow(moviesList, rowId) {
  const row = document.getElementById(rowId);
  row.innerHTML = '';
  const list = (rowId === 'topMoviesRow') ? moviesList.slice(0, 10) : moviesList;
  list.forEach((movie, idx) => {
    allMovies[movie.id] = movie; // Met à jour le cache global
    const isFavorite = favorites.includes(movie.id);
    const card = document.createElement('div');
    card.className = 'movie-card';
    let rank = '';
    if (rowId === 'topMoviesRow') {
      rank = `<div class='movie-rank'>${idx + 1}</div>`;
    }
    card.innerHTML = `
      ${rank}
      <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/300x450?text=Image+non+disponible'}" alt="${movie.title}" loading="lazy">
      <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${movie.id}, event)">
        <i class="fas fa-heart"></i>
      </button>
      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-meta">
          <span>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
          <span>${(movie.release_date || "").split("-")[0]}</span>
        </div>
      </div>`;
    card.addEventListener('click', e => { if (!e.target.closest('.favorite-btn')) showModal(movie.id); });
    row.appendChild(card);
  });
}


function loadMoreAnimation() { fetchCategory({endpoint: '/discover/movie?with_genres=16', rowId: 'animationMoviesRow', nbPages: 1, pageVar: 'animationPage', moviesVar: 'animationMovies'}); }
fetchCategory({endpoint: '/discover/movie?with_genres=16', rowId: 'animationMoviesRow', nbPages: 3, pageVar: 'animationPage', moviesVar: 'animationMovies'});

document.addEventListener('DOMContentLoaded', () => {
  const loadMoreAnimationBtn = document.getElementById('loadMoreAnimationBtn');
  if (loadMoreAnimationBtn) {
    loadMoreAnimationBtn.addEventListener('click', loadMoreAnimation);
  }

  const loadMoreActionBtn = document.getElementById('loadMoreActionBtn');
  if (loadMoreActionBtn) {
    loadMoreActionBtn.addEventListener('click', loadMoreAction);
  }
  const loadMoreComedyBtn = document.getElementById('loadMoreComedyBtn');
  if (loadMoreComedyBtn) {
    loadMoreComedyBtn.addEventListener('click', loadMoreComedy);
  }
  const loadMoreScifiBtn = document.getElementById('loadMoreScifiBtn');
  if (loadMoreScifiBtn) {
    loadMoreScifiBtn.addEventListener('click', loadMoreScifi);
  }
});

// flèches de navigation pour le top
document.addEventListener('DOMContentLoaded', () => {
  const leftArrow = document.getElementById('topLeftArrow');
  const rightArrow = document.getElementById('topRightArrow');
  const topRow = document.getElementById('topMoviesRow');
  if (leftArrow && rightArrow && topRow) {
    leftArrow.addEventListener('click', () => {
      topRow.scrollBy({ left: -220, behavior: 'smooth' });
    });
    rightArrow.addEventListener('click', () => {
      topRow.scrollBy({ left: 220, behavior: 'smooth' });
    });
  }
});
