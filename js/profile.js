const userProfile = document.getElementById('userProfile');
const profileDropdown = document.getElementById('profileDropdown');

userProfile.addEventListener('click', function(e) {
  e.stopPropagation(); 
  profileDropdown.classList.toggle('active');
});

document.addEventListener('click', function() {
  profileDropdown.classList.remove('active');
});


