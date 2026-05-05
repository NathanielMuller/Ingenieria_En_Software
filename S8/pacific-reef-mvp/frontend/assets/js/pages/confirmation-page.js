import { apiRequest } from '../api.js';
import { getLanguage } from '../session.js';

const code = new URLSearchParams(window.location.search).get('code');
const title = document.querySelector('#confirmation-title');
const summary = document.querySelector('#confirmation-summary');
const qrImage = document.querySelector('#confirmation-qr-image');
const qrText = document.querySelector('#confirmation-qr-text');

const text = {
  es: {
    noSelectionTitle: 'No hay reserva seleccionada',
    noSelectionMessage: 'Debes confirmar una reserva antes de abrir esta pantalla.',
    confirmedTitle: 'Reserva confirmada',
    code: 'Codigo de reserva',
    room: 'Habitacion',
    paymentConfirmed: 'Pago confirmado',
    email: 'Correo',
    ticket: 'Ticket',
    qrAlt: 'QR de la reserva',
    qrReception: 'Codigo para validacion en recepcion',
    loadError: 'No fue posible cargar la confirmacion'
  },
  en: {
    noSelectionTitle: 'No booking selected',
    noSelectionMessage: 'You must confirm a booking before opening this screen.',
    confirmedTitle: 'Booking confirmed',
    code: 'Booking code',
    room: 'Room',
    paymentConfirmed: 'Confirmed payment',
    email: 'Email',
    ticket: 'Ticket',
    qrAlt: 'Booking QR',
    qrReception: 'Code for validation at reception',
    loadError: 'Unable to load confirmation'
  }
};

function currentText() {
  return text[getLanguage()] || text.es;
}

async function loadConfirmation() {
  const dictionary = currentText();
  if (!code) {
    title.textContent = dictionary.noSelectionTitle;
    summary.innerHTML = `<p class="mb-0 text-danger">${dictionary.noSelectionMessage}</p>`;
    return;
  }

  try {
    const reservation = await apiRequest(`/reservations/${code}`);
    title.textContent = dictionary.confirmedTitle;
    summary.innerHTML = `
      <div class="summary-line"><span>${dictionary.code}</span><strong>${reservation.codigoReserva}</strong></div>
      <div class="summary-line"><span>${dictionary.room}</span><strong>${reservation.habitacion}</strong></div>
      <div class="summary-line"><span>${dictionary.paymentConfirmed}</span><strong>${reservation.montoReservaFormateado}</strong></div>
      <div class="summary-line"><span>${dictionary.email}</span><strong>${reservation.correo}</strong></div>
      <div class="summary-line"><span>${dictionary.ticket}</span><strong>${reservation.codigoTicket}</strong></div>
    `;
    qrImage.src = reservation.codigoQr;
    qrImage.alt = `${dictionary.qrAlt} ${reservation.codigoReserva}`;
    qrText.textContent = `${dictionary.qrReception}: ${reservation.codigoTicket}`;
  } catch (error) {
    title.textContent = dictionary.loadError;
    summary.innerHTML = `<p class="mb-0 text-danger">${error.message}</p>`;
  }
}

loadConfirmation();