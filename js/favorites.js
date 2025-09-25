// Gestion des favoris
function toggleFavorite(id, event){
  if(event) event.stopPropagation();
  favorites = favorites.includes(id) ? favorites.filter(fav=>fav!==id) : [...favorites,id];
  localStorage.setItem('favorites', JSON.stringify(favorites));
  
  if(event){
    if(event.target.classList.contains('favorite-toggle-btn')){
      event.target.classList.toggle('active');
      event.target.innerHTML = `<i class="fas fa-plus"></i> ${favorites.includes(id)?'Retirer':'Ajouter'}`;
    }
    if(event.target.closest('.favorite-btn')){
      event.target.closest('.favorite-btn').classList.toggle('active');
    }
    if(document.getElementById('favoritesPage').classList.contains('active')) displayFavorites();
  }
}

function displayFavorites(){
  const grid=document.getElementById('favoritesGrid');
  if(favorites.length===0){
    grid.innerHTML='<p style="grid-column:1/-1;text-align:center;padding:40px;">Aucun film favori pour le moment</p>';
    return;
  }
  grid.innerHTML='';
  favorites.forEach(id=>{
    const movie = allMovies[id]; if(!movie) return;
    const card = document.createElement('div'); card.className='movie-card';
    card.innerHTML=`<img src="${movie.poster_path?IMAGE_BASE_URL+movie.poster_path:'https://via.placeholder.com/300x450?text=Image+non+disponible'}" alt="${movie.title}">
      <button class="favorite-btn active" onclick="toggleFavorite(${movie.id}, event)">
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
