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

const form = document.getElementById('seriesForm');
const seriesList = document.getElementById('seriesList');

let seriesData = JSON.parse(localStorage.getItem('seriesData')) || [];

if (form && seriesList) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const episodes = Number(document.getElementById('episodes').value);
    let watched = Number(document.getElementById('watched').value);

    if (!title || episodes < 1 || watched < 0) {
      alert('Заполните поля правильно');
      return;
    }

    if (watched > episodes) {
      watched = episodes;
    }

    const newSeries = {
      id: Date.now(),
      title: title,
      episodes: episodes,
      watched: watched
    };

    seriesData.push(newSeries);
    localStorage.setItem('seriesData', JSON.stringify(seriesData));

    form.reset();
    renderSeries();
  });

  renderSeries();
}

function renderSeries() {
  if (!seriesList) return;

  if (seriesData.length === 0) {
    seriesList.innerHTML = `
      <div class="empty-state">
        <h3>Пока нет сериалов</h3>
        <p>Добавьте первый сериал через форму выше.</p>
      </div>
    `;
    return;
  }

  seriesList.innerHTML = '';

  seriesData.forEach((item) => {
    const percent = Math.round((item.watched / item.episodes) * 100);

    const card = document.createElement('article');
    card.className = 'product-card';

    card.innerHTML = `
      <div class="product-card__body">
        <h3 class="product-card__title">${item.title}</h3>
        <div class="product-card__meta">
          <span>Просмотрено: ${item.watched}</span>
          <span class="product-card__price">Всего: ${item.episodes}</span>
        </div>
        <p style="margin-bottom: 14px; color: #cbd5e1;">Прогресс: ${percent}%</p>
        <button class="product-card__btn" onclick="addEpisode(${item.id})">+ 1 серия</button>
        <button class="product-card__btn" onclick="removeSeries(${item.id})" style="margin-top:10px; background:#ef4444; color:#fff;">
          Удалить
        </button>
      </div>
    `;

    seriesList.appendChild(card);
  });
}

function addEpisode(id) {
  seriesData = seriesData.map((item) => {
    if (item.id === id && item.watched < item.episodes) {
      item.watched += 1;
    }
    return item;
  });

  localStorage.setItem('seriesData', JSON.stringify(seriesData));
  renderSeries();
}

function removeSeries(id) {
  seriesData = seriesData.filter((item) => item.id !== id);
  localStorage.setItem('seriesData', JSON.stringify(seriesData));
  renderSeries();
}
