// Gestion du mode sombre/clair/sepia
document.getElementById('themeToggle').addEventListener('click', ()=>{
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
    document.body.classList.remove('light-mode', 'sepia-mode');
    currentTheme = 'dark';
    document.querySelector('#themeToggle i').className = 'fas fa-moon';
  }
});
