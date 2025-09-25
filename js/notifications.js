// Gestion des notifications visuelles
const notificationBell = document.getElementById('notificationBell');
const notifBadge = document.getElementById('notifBadge');

// Création de la liste de notifications
let notifList = document.createElement('div');
notifList.className = 'notification-list';
document.body.appendChild(notifList);

let notifications = [];

function showNotification(message, type = 'info') {
  notifications.unshift({ message, type, date: new Date() });
  updateNotifUI();
}

function formatDate(date) {
  return date.toLocaleString('fr-FR', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: '2-digit'
  });
}

function updateNotifUI() {
  notifBadge.style.display = notifications.length ? 'inline-block' : 'none';
  notifBadge.textContent = notifications.length;
  if (notifications.length === 0) {
    notifList.innerHTML = '<div class="notification-item info" style="text-align:center;color:#aaa;">Pas de notification</div>';
  } else {
    notifList.innerHTML = notifications.map((n, i) =>
      `<div class="notification-item ${n.type}" style="display:flex;justify-content:space-between;align-items:center;gap:10px;animation:fadeInNotif 0.3s;">
        <div>
          <strong>${n.type === 'success' ? '✔️' : n.type === 'error' ? '❌' : 'ℹ️'}</strong> ${n.message}<br>
          <span style="font-size:0.8em;color:#aaa;">${formatDate(n.date)}</span>
        </div>
        <button class="notif-close" title="Supprimer" aria-label="Supprimer la notification" data-index="${i}" style="background:none;border:none;color:#e50914;font-size:1.2em;cursor:pointer;">&times;</button>
      </div>`
    ).join('');
  }
  notifList.style.display = 'none'; // Toujours masqué par défaut
}

notifList.addEventListener('click', function(e) {
  if (e.target.classList.contains('notif-close')) {
    const idx = parseInt(e.target.getAttribute('data-index'));
    notifications.splice(idx, 1);
    updateNotifUI();
    if (notifications.length === 0) notifList.style.display = 'none';
    e.stopPropagation();
  }
});

if (notificationBell) {
  notificationBell.addEventListener('click', function(e) {
    e.stopPropagation();
    notifList.style.display = notifList.style.display === 'block' ? 'none' : 'block';
    notifList.style.position = 'absolute';
    notifList.style.top = (notificationBell.getBoundingClientRect().bottom + window.scrollY) + 'px';
    notifList.style.right = (window.innerWidth - notificationBell.getBoundingClientRect().right) + 'px';
  });
}

document.addEventListener('click', (e) => {
  if (!notificationBell.contains(e.target) && !notifList.contains(e.target)) {
    notifList.style.display = 'none';
  }
});

// Initialisation de l'affichage de la liste au chargement
updateNotifUI();

// Exemple d'utilisation :
// showNotification('Nouveau film disponible !', 'info');
// showNotification('Ajouté aux favoris', 'success');
// showNotification('Erreur lors de la recherche', 'error');
