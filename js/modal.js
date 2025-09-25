// Gestion de la fenêtre modale pour les détails du film
async function showModal(id){
  try{
    const movie = allMovies[id];
    const detailsRes = await fetch(`${BASE_URL}/movie/${id}?language=fr-FR&append_to_response=credits,videos`,options);
    const details = await detailsRes.json();

    // Vidéo ou image
    let trailer=details.videos.results.find(v=>v.type==="Trailer"&&v.site==="YouTube");
    let mediaContent=trailer? `<iframe src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>` : `<img src="${movie.backdrop_path?IMAGE_BASE_URL+movie.backdrop_path:IMAGE_BASE_URL+movie.poster_path}" alt="${movie.title}">`;

    // Construction de la modale
    const modal=document.getElementById('movieModal');
    modal.setAttribute('aria-hidden','false');
    modal.innerHTML=`<div class="modal-content">
      <div class="modal-header">${mediaContent}
        <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">
        <h2>${movie.title}</h2>
        <div class="modal-meta">
          <span><i class="fas fa-calendar-alt"></i> ${(movie.release_date||"").split("-")[0]}</span>
          <span><i class="fas fa-clock"></i> ${details.runtime?`${Math.floor(details.runtime/60)}h ${details.runtime%60}m`:"Durée inconnue"}</span>
          <span><i class="fas fa-star"></i> ${movie.vote_average?movie.vote_average.toFixed(1):"N/A"}</span>
        </div>
        <div class="action-buttons">
          <button class="play-btn"><i class="fas fa-play"></i> Lire</button>
          <button class="favorite-btn${favorites.includes(id)?' active':''}" onclick="toggleFavorite(${id}, event)">
            <i class="fas fa-heart"></i>
          </button>
          <button onclick="likeMovie(${id})"><i class="fas fa-thumbs-up"></i> J'aime</button>
        </div>
        <p>${movie.overview || "Aucune description disponible."}</p>
        <p><strong>Genres :</strong> ${details.genres.map(g=>g.name).join(", ")}</p>
        <p><strong>Réalisateur :</strong> ${details.credits?.crew?.find(c=>c.job==="Director")?.name || "—"}</p>
        <p><strong>Acteurs principaux :</strong> ${details.credits?.cast?.slice(0,5).map(c=>c.name).join(", ") || "—"}</p>
        <h3>Recommandations</h3>
        <div class="rec-container" id="recCards"><div class="loading"><div class="spinner"></div></div></div>
      </div></div>`;
    modal.classList.add('show');

    // Recommandations de films (similaires)
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

function likeMovie(id){ 
  alert("Vous aimez ce film !"); 
}
