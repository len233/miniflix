const BASE_URL = "https://api.themoviedb.org/3";
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    const options = { method: "GET", headers: { accept: "application/json", Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNGI5MDMyNzIyN2M4OGRhYWMxNGMwYmQwYzFmOTNjZCIsIm5iZiI6MTc1ODY0ODMyMS43NDg5OTk4LCJzdWIiOiI2OGQyZDgwMTJhNWU3YzBhNDVjZWNmZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.aylEitwtAH0w4XRk8izJNNkF_bet8sxiC9iI-zSdHbU"}};

    let allMovies = {};
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let currentTheme = 'dark'; // 'dark', 'light', 'sepia'

    // Navigation
    document.getElementById('homeBtn').addEventListener('click', () => { showPage('homePage'); setActiveButton('homeBtn'); });
    document.getElementById('favoritesBtn').addEventListener('click', () => { showPage('favoritesPage'); setActiveButton('favoritesBtn'); displayFavorites(); });

    function showPage(pageId){
      document.getElementById('homePage').style.display = pageId==='homePage'?'block':'none';
      document.getElementById('favoritesPage').classList.toggle('active', pageId==='favoritesPage');
    }

    function setActiveButton(buttonId){
      document.querySelectorAll('.nav-btn').forEach(btn=>btn.classList.remove('active'));
      document.getElementById(buttonId).classList.add('active');
    }

    // Mode sombre/clair/sepia
    document.getElementById('themeToggle').addEventListener('click', ()=>{
      // Cycle entre les thèmes
      if (currentTheme === 'dark') {
        document.body.classList.remove('light-mode');
        document.body.classList.add('sepia-mode');
        currentTheme = 'sepia';
        document.querySelector('#themeToggle i').className = 'fas fa-film';
      } else if (currentTheme === 'sepia') {
        document.body.classList.remove('sepia-mode');
        document.body.classList.add('light-mode');
        currentTheme = 'light';
        document.querySelector('#themeToggle i').className = 'fas fa-sun';
      } else {
        document.body.classList.remove('light-mode');
        document.body.classList.remove('sepia-mode');
        currentTheme = 'dark';
        document.querySelector('#themeToggle i').className = 'fas fa-moon';
      }
    });

    // Gestion du profil utilisateur
      const userProfile = document.getElementById('userProfile');
      const profileDropdown = document.getElementById('profileDropdown');
      
      userProfile.addEventListener('click', function(e) {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
      });
      
      // Fermer le dropdown quand on clique ailleurs
      document.addEventListener('click', function() {
        profileDropdown.classList.remove('active');
      });
      
      // Empêcher la fermeture quand on clique dans le dropdown
      profileDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
      });

    // Recherche avec debounce
    let searchTimeout;

    document.getElementById('searchInput').addEventListener('input', e => {
      // Afficher ou cacher la croix
      const clearBtn = document.getElementById('clearSearchBtn');
      if (e.target.value.length > 0) {
        clearBtn.style.display = 'block';
      } else {
        clearBtn.style.display = 'none';
      }
// Logique pour effacer la barre de recherche
document.getElementById('clearSearchBtn').addEventListener('click', function(e) {
  e.preventDefault();
  const input = document.getElementById('searchInput');
  input.value = '';
  this.style.display = 'none';
  document.getElementById('searchResultsSection').style.display = 'none';
  document.getElementById('homePage').querySelectorAll('section:not(#searchResultsSection)').forEach(s => s.style.display = '');
  input.focus();
});
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      if (query.length < 2) {
        document.getElementById('searchResultsSection').style.display = 'none';
        document.getElementById('homePage').querySelectorAll('section:not(#searchResultsSection)').forEach(s => s.style.display = '');
        return;
      }
      searchTimeout = setTimeout(() => searchMovies(query), 400);
    });

    async function searchMovies(query) {
      try {
        // Masquer les autres sections
        document.getElementById('homePage').querySelectorAll('section:not(#searchResultsSection)').forEach(s => s.style.display = 'none');
        document.getElementById('searchResultsSection').style.display = '';
        const row = document.getElementById('searchResultsRow');
        row.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=fr-FR`;
        const res = await fetch(url, options);
        const data = await res.json();
        if (!data.results || data.results.length === 0) {
          row.innerHTML = '<p style="padding:40px;text-align:center;">Aucun film trouvé</p>';
          return;
        }
        addMoviesToRow(data.results, 'searchResultsRow');
      } catch (e) {
        console.error(e);
        document.getElementById('searchResultsRow').innerHTML = '<p>Erreur lors de la recherche</p>';
      }
    }

    // Toggle favoris
    function toggleFavorite(id, event){
      if(event) event.stopPropagation();
      favorites = favorites.includes(id) ? favorites.filter(fav=>fav!==id) : [...favorites,id];
      localStorage.setItem('favorites', JSON.stringify(favorites));
      if(event){
        // Pour bouton modal
        if(event.target.classList.contains('favorite-toggle-btn')){
          event.target.classList.toggle('active');
          event.target.innerHTML = `<i class=\"fas fa-plus\"></i> ${favorites.includes(id)?'Retirer':'Ajouter'}`;
        }
        // Pour bouton carte
        if(event.target.closest('.favorite-btn')){
          event.target.closest('.favorite-btn').classList.toggle('active');
        }
        if(document.getElementById('favoritesPage').classList.contains('active')) displayFavorites();
      }
    }

    function displayFavorites(){
      const grid=document.getElementById('favoritesGrid');
      if(favorites.length===0){grid.innerHTML='<p style="grid-column:1/-1;text-align:center;padding:40px;">Aucun film favori pour le moment</p>'; return;}
      grid.innerHTML='';
      favorites.forEach(id=>{
        const movie = allMovies[id]; if(!movie) return;
        const card = document.createElement('div'); card.className='movie-card';
        card.innerHTML=`<img src="${movie.poster_path?IMAGE_BASE_URL+movie.poster_path:'https://via.placeholder.com/300x450?text=Image+non+disponible'}" alt="${movie.title}">
          <button class="favorite-btn active" aria-label="Retirer des favoris" onclick="toggleFavorite(${movie.id}, event)">
            <i class="fas fa-heart"></i>
          </button>
          <div class="movie-info">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-meta">
              <span>⭐ ${movie.vote_average?movie.vote_average.toFixed(1):"N/A"}</span>
              <span>${(movie.release_date||"").split("-")[0]}</span>
            </div>
          </div>`;
        card.addEventListener('click',()=>showModal(movie.id));
        grid.appendChild(card);
      });
    }

    // Modal avec aria-hidden dynamique
    async function showModal(id){
      try{
        const movie = allMovies[id];
        const detailsRes = await fetch(`${BASE_URL}/movie/${id}?language=fr-FR&append_to_response=credits,videos`,options);
        const details = await detailsRes.json();
        let trailer=details.videos.results.find(v=>v.type==="Trailer"&&v.site==="YouTube");
        let mediaContent=trailer? `<iframe src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
                                  : `<img src="${movie.backdrop_path?IMAGE_BASE_URL+movie.backdrop_path:IMAGE_BASE_URL+movie.poster_path}" alt="${movie.title}">`;
        const modal=document.getElementById('movieModal');
        modal.setAttribute('aria-hidden','false');
        modal.innerHTML=`<div class="modal-content">
          <div class="modal-header">${mediaContent}
            <button class="modal-close" aria-label="Fermer le modal" onclick="closeModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <h2>${movie.title}</h2>
            <div class="modal-meta">
              <span><i class="fas fa-calendar-alt"></i> ${(movie.release_date||"").split("-")[0]}</span>
              <span><i class="fas fa-clock"></i> ${details.runtime?`${Math.floor(details.runtime/60)}h ${details.runtime%60}m`:"Durée inconnue"}</span>
              <span><i class="fas fa-star"></i> ${movie.vote_average?movie.vote_average.toFixed(1):"N/A"}</span>
            </div>
            <div class="action-buttons">
              <button class="play-btn" aria-label="Lire ${movie.title}"><i class="fas fa-play"></i> Lire</button>
              <button class="favorite-btn${favorites.includes(id)?' active':''}" aria-label="${favorites.includes(id)?'Retirer':'Ajouter'} des favoris" onclick="toggleFavorite(${id}, event)">
                <i class="fas fa-heart"></i>
              </button>
              <button onclick="likeMovie(${id})" aria-label="J'aime ${movie.title}"><i class="fas fa-thumbs-up"></i> J'aime</button>
            </div>
            <p>${movie.overview || "Aucune description disponible."}</p>
            <p><strong>Genres :</strong> ${details.genres.map(g=>g.name).join(", ")}</p>
            <p><strong>Réalisateur :</strong> ${details.credits?.crew?.find(c=>c.job==="Director")?.name || "—"}</p>
            <p><strong>Acteurs principaux :</strong> ${details.credits?.cast?.slice(0,5).map(c=>c.name).join(", ") || "—"}</p>
            <h3>Recommandations</h3>
            <div class="rec-container" id="recCards"><div class="loading"><div class="spinner"></div></div></div>
          </div></div>`;
        modal.classList.add('show');

        // Recommandations
        const recRes=await fetch(`${BASE_URL}/movie/${id}/recommendations?language=fr-FR`,options);
        const recData=await recRes.json();
        const recRow=document.getElementById('recCards');
        recRow.innerHTML='';
        recData.results.slice(0,8).forEach(rec=>{
          allMovies[rec.id]=rec;
          const recCard=document.createElement('div'); recCard.className='rec-card';
          recCard.innerHTML=`<img src="${rec.poster_path?IMAGE_BASE_URL+rec.poster_path:'https://via.placeholder.com/150x225?text=Image+non+disponible'}" alt="${rec.title}">
            <div class="rec-card-title">${rec.title}</div>`;
          recCard.addEventListener('click',()=>{closeModal(); setTimeout(()=>showModal(rec.id),300);});
          recRow.appendChild(recCard);
        });
      }catch(e){console.error(e);}
    }

   function closeModal(){
        const modal = document.getElementById('movieModal');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = ''; 
    }

    function likeMovie(id){ alert("Vous aimez ce film !"); }

    // Chargement initial
  fetchMovies("/movie/popular", "topMoviesRow", 3);
  fetchMovies("/discover/movie?with_genres=28", "actionMoviesRow", 3);
  fetchMovies("/discover/movie?with_genres=35,10749", "comedyMoviesRow", 3);
  fetchMovies("/discover/movie?with_genres=878", "scifiMoviesRow", 3);

    document.getElementById('movieModal').addEventListener('click', e=>{ if(e.target.id==='movieModal') closeModal(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

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
          <button class="favorite-btn ${isFavorite?'active':''}" aria-label="${isFavorite?'Retirer':'Ajouter'} des favoris" onclick="toggleFavorite(${movie.id}, event)">
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