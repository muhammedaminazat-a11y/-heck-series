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

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.remove('active');
    }
  });
}

const form = document.getElementById('seriesForm');
const seriesList = document.getElementById('seriesList');

let seriesData = JSON.parse(localStorage.getItem('seriesData')) || [];

if (form && seriesList) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const titleInput = document.getElementById('title');
    const imageInput = document.getElementById('image');
    const episodesInput = document.getElementById('episodes');
    const watchedInput = document.getElementById('watched');

    const title = titleInput.value.trim();
    const image = imageInput ? imageInput.value.trim() : '';
    const episodes = Number(episodesInput.value);
    let watched = Number(watchedInput.value);

    if (!title || episodes < 1 || watched < 0) {
      alert('Заполните поля правильно.');
      return;
    }

    if (watched > episodes) {
      watched = episodes;
    }

    const newSeries = {
      id: Date.now(),
      title: title,
      image: image,
      episodes: episodes,
      watched: watched
    };

    seriesData.push(newSeries);
    saveSeries();
    form.reset();
    renderSeries();
  });

  renderSeries();
}

function saveSeries() {
  localStorage.setItem('seriesData', JSON.stringify(seriesData));
}

function renderSeries() {
  if (!seriesList) {
    return;
  }

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
    const imageSrc =
      item.image && item.image.length > 0
        ? item.image
        : 'Image/image.png';

    const isCompleted = item.watched >= item.episodes;

    const card = document.createElement('article');
    card.className = isCompleted
      ? 'product-card product-card--completed'
      : 'product-card';

    card.innerHTML = `
      <div class="product-card__image">
        <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(item.title)}">
      </div>

      <div class="product-card__body">
        <h3 class="product-card__title">${escapeHtml(item.title)}</h3>

        <div class="product-card__meta">
          <span>Просмотрено: ${item.watched}</span>
          <span class="product-card__price">Всего: ${item.episodes}</span>
        </div>

        <p class="product-card__progress">Прогресс: ${percent}%</p>

        ${
          isCompleted
            ? '<p class="product-card__done">Сериал завершён ✔</p>'
            : ''
        }

        ${
          isCompleted
            ? '<button class="product-card__btn product-card__btn--complete" disabled>Просмотр завершён</button>'
            : `<button class="product-card__btn" onclick="addEpisode(${item.id})">+ 1 серия</button>`
        }

        <button class="product-card__btn product-card__btn--danger" onclick="removeSeries(${item.id})">
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
      return {
        ...item,
        watched: item.watched + 1
      };
    }
    return item;
  });

  saveSeries();
  renderSeries();
}

function removeSeries(id) {
  seriesData = seriesData.filter((item) => item.id !== id);
  saveSeries();
  renderSeries();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.addEpisode = addEpisode;
window.removeSeries = removeSeries;

const homeSeries = document.getElementById('homeSeries');

if (homeSeries) {
  renderHomeSeries();
}

function renderHomeSeries() {
  let data = JSON.parse(localStorage.getItem('seriesData')) || [];

  if (data.length === 0) {
    homeSeries.innerHTML = `
      <div class="empty-state">
        <p>Пока нет сериалов. Добавьте их в каталоге.</p>
      </div>
    `;
    return;
  }

  // берём последние 3 сериала
  data = data.slice(-3).reverse();

  homeSeries.innerHTML = '';

  data.forEach((item) => {
    const percent = Math.round((item.watched / item.episodes) * 100);
    const imageSrc = item.image && item.image.length > 0
      ? item.image
      : 'Image/image.png';

    const isCompleted = item.watched >= item.episodes;

    const card = document.createElement('article');
    card.className = isCompleted
      ? 'product-card product-card--completed'
      : 'product-card';

    card.innerHTML = `
      <div class="product-card__image">
        <img src="${imageSrc}" alt="${item.title}">
      </div>

      <div class="product-card__body">
        <h3 class="product-card__title">${item.title}</h3>
        <p class="product-card__progress">Прогресс: ${percent}%</p>
      </div>
    `;

    homeSeries.appendChild(card);
  });
}
