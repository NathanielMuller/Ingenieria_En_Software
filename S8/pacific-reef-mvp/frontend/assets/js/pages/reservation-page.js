import { apiRequest } from '../api.js';
import { buildUrl, getCurrentUser, getLanguage, mergeSearchContext, setSearchContext } from '../session.js';

const currentUser = getCurrentUser();
const searchContext = mergeSearchContext(new URLSearchParams(window.location.search));
setSearchContext(searchContext);

const form = document.querySelector('#reservation-form');
const authNotice = document.querySelector('#reservation-auth-notice');
const reservationMessage = document.querySelector('#reservation-message');
const roomName = document.querySelector('#summary-room-name');
const totalNights = document.querySelector('#summary-total-days');
const totalAmount = document.querySelector('#summary-total-amount');
const reservationAmount = document.querySelector('#summary-reservation-amount');
const pendingAmount = document.querySelector('#summary-pending-amount');
const validations = document.querySelector('#reservation-validations');

const text = {
  es: {
    selectRoom: 'Debes seleccionar una habitacion antes de reservar.',
    nights: 'noches x',
    roomAvailable: 'Habitacion disponible',
    roomRecheck: 'La habitacion requiere nueva validacion',
    dateRange: 'Rango de fechas',
    capacity: 'Capacidad maxima',
    guests: 'huespedes',
    signInClient: 'Debes iniciar sesion como cliente para confirmar la reserva.',
    bookingConfirmed: 'Reserva confirmada. Redirigiendo a la confirmacion...'
  },
  en: {
    selectRoom: 'You must select a room before booking.',
    nights: 'nights x',
    roomAvailable: 'Room available',
    roomRecheck: 'Room requires a new validation',
    dateRange: 'Date range',
    capacity: 'Maximum capacity',
    guests: 'guests',
    signInClient: 'You must sign in as a guest to confirm the booking.',
    bookingConfirmed: 'Booking confirmed. Redirecting to confirmation...'
  }
};

function currentText() {
  return text[getLanguage()] || text.es;
}

function currencyFormatter() {
  return new Intl.NumberFormat(getLanguage() === 'en' ? 'en-US' : 'es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });
}

function showMessage(message, isError = false) {
  reservationMessage.className = `alert ${isError ? 'alert-danger' : 'alert-success'} mt-3`;
  reservationMessage.textContent = message;
  reservationMessage.classList.remove('d-none');
}

async function loadReservationSummary() {
  const dictionary = currentText();
  if (!searchContext.roomId) {
    showMessage(dictionary.selectRoom, true);
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  try {
    const query = new URLSearchParams({
      checkIn: searchContext.checkIn,
      checkOut: searchContext.checkOut
    });
    const room = await apiRequest(`/rooms/${searchContext.roomId}?${query.toString()}`);
    roomName.textContent = room.nombre;
    totalNights.textContent = `${room.totalDias} ${dictionary.nights} ${room.precioFormateado}`;
    totalAmount.textContent = room.montoTotalFormateado;
    reservationAmount.textContent = room.montoReservaFormateado;
    pendingAmount.textContent = currencyFormatter().format(room.montoTotal - room.montoReserva);
    validations.innerHTML = `
      <li>${room.disponibilidad ? dictionary.roomAvailable : dictionary.roomRecheck}</li>
      <li>${dictionary.dateRange} ${searchContext.checkIn} a ${searchContext.checkOut}</li>
      <li>${dictionary.capacity} ${room.capacidad} ${dictionary.guests}</li>
    `;
  } catch (error) {
    showMessage(error.message, true);
  }
}

if (!currentUser || currentUser.role !== 'cliente') {
  authNotice.classList.remove('d-none');
  form.querySelector('button[type="submit"]').disabled = true;
  authNotice.childNodes[0].textContent = `${currentText().signInClient} `;
  authNotice.querySelector('a').href = buildUrl('/acceso.html', {
    redirect: buildUrl('/reserva.html', searchContext)
  });
} else {
  form.nombre.value = `${currentUser.nombre} ${currentUser.apellido}`;
  form.correo.value = currentUser.correo;
}

form.checkIn.value = searchContext.checkIn || '';
form.checkOut.value = searchContext.checkOut || '';
form.guests.value = searchContext.guests || '1';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'cliente') {
    return;
  }

  const formData = new FormData(form);

  try {
    const reservation = await apiRequest('/reservations', {
      method: 'POST',
      body: JSON.stringify({
        userId: currentUser.id,
        roomId: Number(searchContext.roomId),
        checkIn: formData.get('checkIn'),
        checkOut: formData.get('checkOut'),
        guests: Number(formData.get('guests')),
        paymentMethod: formData.get('paymentMethod'),
        observations: formData.get('observations')
      })
    });

    showMessage(currentText().bookingConfirmed);
    window.location.href = buildUrl('/confirmacion.html', { code: reservation.reservationCode });
  } catch (error) {
    showMessage(error.message, true);
  }
});

loadReservationSummary();