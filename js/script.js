function markWatched(button) {
  button.innerText = 'Просмотрено ✔';
  button.style.background = '#22c55e';
  button.style.color = '#ffffff';
}

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('burger--active');
    nav.classList.toggle('nav--open');
    document.body.classList.toggle('no-scroll');
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a') || event.target.closest('button')) {
      burger.classList.remove('burger--active');
      nav.classList.remove('nav--open');
      document.body.classList.remove('no-scroll');
    }
  });
}

const modal = document.getElementById('authModal');
const openButtons = document.querySelectorAll('.header__cta');
const closeModal = document.getElementById('closeModal');

if (modal && openButtons.length && closeModal) {
  openButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.classList.add('active');
    });
  });

  closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}