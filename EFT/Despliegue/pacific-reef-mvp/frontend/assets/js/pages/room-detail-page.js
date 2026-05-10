import { apiRequest } from '../api.js';
import { buildUrl, getCurrentUser, getLanguage, mergeSearchContext, setSearchContext } from '../session.js';

const searchContext = mergeSearchContext(new URLSearchParams(window.location.search));
setSearchContext(searchContext);

const title = document.querySelector('#room-title');
const description = document.querySelector('#room-description');
const equipList = document.querySelector('#room-equipment');
const infoList = document.querySelector('#room-info');
const price = document.querySelector('#room-price');
const totalNights = document.querySelector('#room-nights');
const totalAmount = document.querySelector('#room-total');
const reservationAmount = document.querySelector('#room-reservation-amount');
const reserveLink = document.querySelector('#reserve-link');
const galleryMain = document.querySelector('#gallery-main');
const galleryThumbs = document.querySelector('#gallery-thumbs');

const text = {
  es: {
    noRoomTitle: 'Habitacion no seleccionada',
    noRoomDescription: 'Debes volver al listado y elegir una habitacion.',
    fallbackDescription: 'Habitacion disponible para tu estadia.',
    capacity: 'Capacidad para',
    guests: 'huespedes',
    category: 'Categoria',
    available: 'Disponible para las fechas seleccionadas',
    pending: 'Sujeta a confirmacion',
    roomNumber: 'Numero de habitacion',
    nights: 'noches',
    noRange: 'Sin rango de fechas',
    loadError: 'No fue posible cargar la habitacion',
    reserveWithAccount: 'Reservar con mi cuenta',
    noExtraImages: 'Sin imagenes adicionales.'
  },
  en: {
    noRoomTitle: 'No room selected',
    noRoomDescription: 'You must return to the list and choose a room.',
    fallbackDescription: 'Room available for your stay.',
    capacity: 'Capacity for',
    guests: 'guests',
    category: 'Category',
    available: 'Available for the selected dates',
    pending: 'Subject to confirmation',
    roomNumber: 'Room number',
    nights: 'nights',
    noRange: 'No date range selected',
    loadError: 'Unable to load room',
    reserveWithAccount: 'Book with my account',
    noExtraImages: 'No additional images.'
  }
};

function currentText() {
  return text[getLanguage()] || text.es;
}

async function loadRoom() {
  const dictionary = currentText();
  if (!searchContext.roomId) {
    title.textContent = dictionary.noRoomTitle;
    description.textContent = dictionary.noRoomDescription;
    return;
  }

  const query = new URLSearchParams({
    ...(searchContext.checkIn ? { checkIn: searchContext.checkIn } : {}),
    ...(searchContext.checkOut ? { checkOut: searchContext.checkOut } : {})
  });

  try {
    const room = await apiRequest(`/rooms/${searchContext.roomId}?${query.toString()}`);
    title.textContent = room.nombre;
    description.textContent = room.descripcion || room.categoriaDescripcion || dictionary.fallbackDescription;
    equipList.innerHTML = room.equipamientos.map((item) => `<li>${item}</li>`).join('');
    infoList.innerHTML = `
      <li>${dictionary.capacity} ${room.capacidad} ${dictionary.guests}</li>
      <li>${dictionary.category} ${room.categoria}</li>
      <li>${room.disponibilidad ? dictionary.available : dictionary.pending}</li>
      <li>${dictionary.roomNumber} ${room.numero}</li>
    `;
    price.textContent = room.precioFormateado || room.precio;
    totalNights.textContent = room.totalDias ? `${room.totalDias} ${dictionary.nights}` : dictionary.noRange;
    totalAmount.textContent = room.montoTotalFormateado || '-';
    reservationAmount.textContent = room.montoReservaFormateado || '-';
    reserveLink.href = buildUrl('/reserva.html', searchContext);

    galleryMain.innerHTML = `<span class="badge text-bg-light">${room.nombre}</span>`;
    galleryMain.className = 'gallery-main image-one d-flex align-items-end p-4';
    galleryThumbs.innerHTML = (room.equipamientos.slice(0, 3).map((item) => `<div class="col-4"><div class="gallery-thumb image-two d-flex align-items-end p-2"><small class="badge text-bg-light">${item}</small></div></div>`).join('')) || `<div class="col-12 text-muted">${dictionary.noExtraImages}</div>`;
  } catch (error) {
    title.textContent = dictionary.loadError;
    description.textContent = error.message;
  }
}

const currentUser = getCurrentUser();
if (currentUser && currentUser.role === 'cliente') {
  reserveLink.textContent = currentText().reserveWithAccount;
}

loadRoom();