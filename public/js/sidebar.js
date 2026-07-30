const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');

if (window.matchMedia('(max-width: 768px)').matches) {
  sidebar.classList.add('no-transition');
  toggleBtn.classList.add('no-transition');

  sidebar.classList.add('collapsed');
  toggleBtn.classList.add('collapsed');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      sidebar.classList.remove('no-transition');
      toggleBtn.classList.remove('no-transition');
    });
  });
}

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  toggleBtn.classList.toggle('collapsed');
});