// Recherche avec debounce
let searchTimeout;

document.getElementById('searchInput').addEventListener('input', e => {
  const clearBtn = document.getElementById('clearSearchBtn');
  if (e.target.value.length > 0) {
    clearBtn.style.display = 'block';
  } else {
    clearBtn.style.display = 'none';
  }

  clearTimeout(searchTimeout);
  const query = e.target.value.trim();
  if (query.length < 2) {
    document.getElementById('searchResultsSection').style.display = 'none';
    document.getElementById('homePage').querySelectorAll('section:not(#searchResultsSection)').forEach(s => s.style.display = '');
    return;
  }
  searchTimeout = setTimeout(() => searchMovies(query), 400);
});

// Bouton pour effacer la recherche
document.getElementById('clearSearchBtn').addEventListener('click', function(e) {
  e.preventDefault();
  const input = document.getElementById('searchInput');
  input.value = '';
  this.style.display = 'none';
  document.getElementById('searchResultsSection').style.display = 'none';
  document.getElementById('homePage').querySelectorAll('section:not(#searchResultsSection)').forEach(s => s.style.display = '');
  input.focus();
});

// Recherche de films via l'API
async function searchMovies(query) {
  try {
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
