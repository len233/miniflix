// Flèches de navigation pour le top
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
// Gestion pagination pour chaque catégorie
let topPage = 1;
let topMovies = [];
async function fetchTopMovies(nbPages = 3) {
  for (let page = topPage; page < topPage + nbPages; page++) {
    const url = `${BASE_URL}/movie/popular?page=${page}&language=fr-FR`;
    const res = await fetch(url, options);
    const data = await res.json();
    if (Array.isArray(data.results)) {
      topMovies = topMovies.concat(data.results);
    }
  }
  topPage += nbPages;
  // On affiche uniquement les 10 premiers films les plus populaires
  // Toujours maximum 10 films affichés
  addMoviesToRow(topMovies.slice(0, 10), 'topMoviesRow');
}
fetchTopMovies(3);


let actionPage = 1;
let actionMovies = [];
async function fetchActionMovies(nbPages = 3) {
  for (let page = actionPage; page < actionPage + nbPages; page++) {
    const url = `${BASE_URL}/discover/movie?with_genres=28&page=${page}&language=fr-FR`;
    const res = await fetch(url, options);
    const data = await res.json();
    if (Array.isArray(data.results)) {
      actionMovies = actionMovies.concat(data.results);
    }
  }
  actionPage += nbPages;
  addMoviesToRow(actionMovies, 'actionMoviesRow');
}
fetchActionMovies(3);
function loadMoreAction() { fetchActionMovies(1); }

let comedyPage = 1;
let comedyMovies = [];
async function fetchComedyMovies(nbPages = 3) {
  for (let page = comedyPage; page < comedyPage + nbPages; page++) {
    const url = `${BASE_URL}/discover/movie?with_genres=35,10749&page=${page}&language=fr-FR`;
    const res = await fetch(url, options);
    const data = await res.json();
    if (Array.isArray(data.results)) {
      comedyMovies = comedyMovies.concat(data.results);
    }
  }
  comedyPage += nbPages;
  addMoviesToRow(comedyMovies, 'comedyMoviesRow');
}
fetchComedyMovies(3);
function loadMoreComedy() { fetchComedyMovies(1); }

let scifiPage = 1;
let scifiMovies = [];
async function fetchScifiMovies(nbPages = 3) {
  for (let page = scifiPage; page < scifiPage + nbPages; page++) {
    const url = `${BASE_URL}/discover/movie?with_genres=878&page=${page}&language=fr-FR`;
    const res = await fetch(url, options);
    const data = await res.json();
    if (Array.isArray(data.results)) {
      scifiMovies = scifiMovies.concat(data.results);
    }
  }
  scifiPage += nbPages;
  addMoviesToRow(scifiMovies, 'scifiMoviesRow');
}
fetchScifiMovies(3);
function loadMoreScifi() { fetchScifiMovies(1); }
// Chargement des films depuis l'API
async function fetchMovies(endpoint, rowId, pages = 3) { 
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
function addMoviesToRow(moviesList, rowId) {
  const row = document.getElementById(rowId);
  row.innerHTML = '';
  moviesList.forEach((movie, idx) => {
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

// Notification d'un nouveau film 
function notifyNewMovie(movie) {
  if (typeof showNotification === 'function') {
    showNotification(`Nouveau film disponible : ${movie.title}`, 'info');
  }
}

// Récupération et affichage des films d'animation (genre TMDB 16)
const ANIMATION_GENRE_ID = 16;
let animationPage = 1;
let animationMovies = [];

async function fetchAnimationMovies(nbPages = 3) {
  for (let page = animationPage; page < animationPage + nbPages; page++) {
    const url = `${BASE_URL}/discover/movie?with_genres=${ANIMATION_GENRE_ID}&page=${page}&language=fr-FR`;
    const res = await fetch(url, options);
    const data = await res.json();
    if (Array.isArray(data.results)) {
      animationMovies = animationMovies.concat(data.results);
    }
  }
  animationPage += nbPages;
  addMoviesToRow(animationMovies, 'animationMoviesRow');
}

fetchAnimationMovies(3);

// Fonction pour charger plus de films d'animation (à relier à un bouton)
function loadMoreAnimation() {
  fetchAnimationMovies(1); // Charge 1 page supplémentaire
}

// Ajout de l'écouteur pour le bouton 'Voir plus' Animation (span comme les autres)
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
