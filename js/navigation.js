// Navigation entre les pages
document.getElementById('homeBtn').addEventListener('click', () => { 
  showPage('homePage'); 
  setActiveButton('homeBtn'); 
});

document.getElementById('favoritesBtn').addEventListener('click', () => { 
  showPage('favoritesPage'); 
  setActiveButton('favoritesBtn'); 
  displayFavorites(); 
});

function showPage(pageId){
  document.getElementById('homePage').style.display = pageId==='homePage'?'block':'none';
  document.getElementById('favoritesPage').classList.toggle('active', pageId==='favoritesPage');
}

function setActiveButton(buttonId){
  document.querySelectorAll('.nav-btn').forEach(btn=>btn.classList.remove('active'));
  document.getElementById(buttonId).classList.add('active');
}
