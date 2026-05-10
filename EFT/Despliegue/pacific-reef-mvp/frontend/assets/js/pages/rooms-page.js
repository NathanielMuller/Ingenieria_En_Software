import { apiRequest } from '../api.js';
import { buildUrl, getLanguage, mergeSearchContext, setSearchContext } from '../session.js';

const searchParams = new URLSearchParams(window.location.search);
let searchContext = mergeSearchContext(searchParams);
const summary = document.querySelector('#search-summary');
const roomsContainer = document.querySelector('#rooms-container');
const categoryFilter = document.querySelector('#category-filter');
const applyFiltersButton = document.querySelector('#apply-filters');
const clearSearchButton = document.querySelector('#clear-search');
const priceFilter = document.querySelector('#price-filter');
const priceFilterValue = document.querySelector('#price-filter-value');
const checkinFilter = document.querySelector('#checkin-filter');
const checkoutFilter = document.querySelector('#checkout-filter');
const guestsFilter = document.querySelector('#guests-filter');

// Precarga los valores en los inputs desde el searchContext actual
function syncFiltersFromContext() {
  if (checkinFilter) checkinFilter.value = searchContext.checkIn || '';
  if (checkoutFilter) checkoutFilter.value = searchContext.checkOut || '';
  if (guestsFilter) guestsFilter.value = searchContext.guests || 1;
}

syncFiltersFromContext();

const uiText = {
  es: {
    searchSuffix: 'huespedes',
    catalogTitle: 'Catalogo de habitaciones disponibles',
    searchTitle: (ctx) => `${ctx.checkIn} — ${ctx.checkOut} | ${ctx.guests} huesped(es)`,
    clearSearch: 'Ver todo el catalogo',
    loading: 'Cargando habitaciones...',
    noRoomsTitle: 'No hay habitaciones disponibles',
    noRoomsText: 'Prueba con otro rango de fechas, menos huespedes, u otro filtro.',
    noRoomsTextCatalog: 'Prueba cambiando los filtros de categoria o precio.',
    roomGuests: 'huespedes',
    roomFallback: 'Habitacion disponible para tu estadia.',
    nights: 'noche',
    bookingDeposit: 'abono inicial',
    detail: 'Ver detalle',
    book: 'Reservar'
  },
  en: {
    searchSuffix: 'guests',
    catalogTitle: 'Available rooms catalog',
    searchTitle: (ctx) => `${ctx.checkIn} — ${ctx.checkOut} | ${ctx.guests} guest(s)`,
    clearSearch: 'View full catalog',
    loading: 'Loading rooms...',
    noRoomsTitle: 'No rooms available',
    noRoomsText: 'Try another date range, fewer guests, or a different filter.',
    noRoomsTextCatalog: 'Try changing the category or price filters.',
    roomGuests: 'guests',
    roomFallback: 'Room available for your stay.',
    nights: 'night',
    bookingDeposit: 'initial deposit',
    detail: 'View detail',
    book: 'Book'
  }
};

function currentText() {
  return uiText[getLanguage()] || uiText.es;
}

setSearchContext(searchContext);

function getImageMarkup(name) {
  return `<div class="room-image image-one d-flex align-items-end p-3"><span class="badge text-bg-light">${name}</span></div>`;
}

function hasSearchContext() {
  return !!(searchContext.checkIn && searchContext.checkOut && searchContext.guests);
}

function renderRooms(rooms) {
  const text = currentText();
  if (!rooms.length) {
    const hint = hasSearchContext() ? text.noRoomsText : text.noRoomsTextCatalog;
    roomsContainer.innerHTML = `
      <div class="col-12">
        <div class="content-card p-4">
          <h2 class="h4 mb-2">${text.noRoomsTitle}</h2>
          <p class="text-muted mb-0">${hint}</p>
        </div>
      </div>
    `;
    return;
  }

  roomsContainer.innerHTML = rooms.map((room) => `
    <div class="col-md-6">
      <article class="room-card h-100">
        ${getImageMarkup(room.nombre)}
        <div class="p-4">
          <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
            <div>
              <h2 class="h4 mb-1">${room.nombre}</h2>
              <p class="text-muted mb-0">${room.capacidad} ${text.roomGuests} | ${room.categoria}</p>
            </div>
            <span class="price-tag">${room.precioFormateado}</span>
          </div>
          <p class="mb-3">${room.descripcion || text.roomFallback}</p>
          <div class="chip-row mb-4">
            ${(room.equipamientos || '').split(',').filter(Boolean).slice(0, 4).map((item) => `<span class="soft-chip">${item.trim()}</span>`).join('')}
          </div>
          <div class="d-flex justify-content-between align-items-center mb-3">
            ${searchContext.checkIn && searchContext.checkOut
              ? `<span class="text-muted small">${room.totalDias} ${text.nights}</span><strong>${room.montoReservaFormateado || room.precioFormateado} ${text.bookingDeposit}</strong>`
              : `<span class="text-muted small">precio por noche</span>`
            }
          </div>
          <div class="d-flex gap-3">
            <a class="btn btn-brand" href="${buildUrl('/detalle-habitacion.html', { ...searchContext, roomId: room.id })}">${text.detail}</a>
            <a class="btn btn-outline-brand" href="${buildUrl('/reserva.html', { ...searchContext, roomId: room.id })}">${text.book}</a>
          </div>
        </div>
      </article>
    </div>
  `).join('');
}

function updateSummaryBar() {
  const text = currentText();
  if (hasSearchContext()) {
    summary.textContent = text.searchTitle(searchContext);
    if (clearSearchButton) {
      clearSearchButton.style.display = 'inline-block';
      clearSearchButton.textContent = text.clearSearch;
    }
  } else {
    summary.textContent = text.catalogTitle;
    if (clearSearchButton) clearSearchButton.style.display = 'none';
  }
}

async function loadRooms() {
  const text = currentText();
  updateSummaryBar();
  roomsContainer.innerHTML = `<div class="col-12"><div class="content-card p-4">${text.loading}</div></div>`;

  try {
    let rooms;
    if (hasSearchContext()) {
      // Filtra por disponibilidad real + capacidad
      const query = new URLSearchParams({
        checkIn: searchContext.checkIn,
        checkOut: searchContext.checkOut,
        guests: searchContext.guests,
        ...(categoryFilter.value ? { category: categoryFilter.value } : {}),
        ...(priceFilter.value ? { maxPrice: priceFilter.value } : {})
      });
      rooms = await apiRequest(`/rooms/availability?${query.toString()}`);
    } else {
      // Sin filtro de fechas: muestra todo el catalogo
      const query = new URLSearchParams({
        ...(categoryFilter.value ? { category: categoryFilter.value } : {}),
        ...(priceFilter.value ? { maxPrice: priceFilter.value } : {})
      });
      rooms = await apiRequest(`/rooms/catalog?${query.toString()}`);
    }
    renderRooms(rooms);
  } catch (error) {
    roomsContainer.innerHTML = `<div class="col-12"><div class="content-card p-4 text-danger">${error.message}</div></div>`;
  }
}

priceFilter?.addEventListener('input', () => {
  priceFilterValue.textContent = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(Number(priceFilter.value || 0));
});

priceFilterValue.textContent = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
}).format(Number(priceFilter?.value || 0));

applyFiltersButton?.addEventListener('click', () => {
  // Toma las fechas y huéspedes de los inputs en el momento de aplicar
  const newCheckIn = checkinFilter?.value || null;
  const newCheckOut = checkoutFilter?.value || null;
  const newGuests = guestsFilter?.value ? Number(guestsFilter.value) : null;
  searchContext = { ...searchContext, checkIn: newCheckIn, checkOut: newCheckOut, guests: newGuests };
  setSearchContext(searchContext);
  loadRooms();
});

clearSearchButton?.addEventListener('click', () => {
  searchContext = { ...searchContext, checkIn: null, checkOut: null, guests: null };
  setSearchContext(searchContext);
  syncFiltersFromContext();
  loadRooms();
});

loadRooms();