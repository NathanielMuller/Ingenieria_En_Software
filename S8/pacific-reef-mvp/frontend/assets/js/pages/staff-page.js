import { apiRequest } from '../api.js';
import { getCurrentUser, getLanguage } from '../session.js';

const currentUser = getCurrentUser();

if (!currentUser || (currentUser.role !== 'trabajador' && currentUser.role !== 'administrador')) {
  const redirect = encodeURIComponent(window.location.pathname);
  window.location.replace(`/acceso.html?redirect=${redirect}`);
}

document.getElementById('worker-logout-btn')?.addEventListener('click', () => {
  clearCurrentUser();
  window.location.href = 'index.html';
});

const calendarContainer = document.querySelector('#worker-calendar');
const tasksContainer = document.querySelector('#worker-tasks');
const reservationsContainer = document.querySelector('#worker-reservations');
const message = document.querySelector('#worker-message');

const text = {
  es: {
    signIn: 'Debes iniciar sesion como trabajador o administrador para usar este panel.',
    weekDays: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
    bookings: 'reservas',
    noOperationalNotes: 'Sin observaciones operativas.',
    noCurrentBookings: 'No hay reservas en curso para hoy.',
    generalFollowUp: 'Seguimiento general',
    noTasks: 'Sin atenciones operativas registradas hoy.'
  },
  en: {
    signIn: 'You must sign in as staff or administrator to use this panel.',
    weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    bookings: 'bookings',
    noOperationalNotes: 'No operational notes.',
    noCurrentBookings: 'There are no active bookings for today.',
    generalFollowUp: 'General follow-up',
    noTasks: 'No operational tasks registered today.'
  }
};

function currentText() {
  return text[getLanguage()] || text.es;
}

function showMessage(text, isError = false) {
  message.className = `alert ${isError ? 'alert-danger' : 'alert-success'} mb-4`;
  message.textContent = text;
  message.classList.remove('d-none');
}

async function loadWorkerDashboard() {
  if (!currentUser || !['trabajador', 'administrador'].includes(currentUser.role)) {
    showMessage(currentText().signIn, true);
    return;
  }

  try {
    const dashboard = await apiRequest('/staff/dashboard');
    const dictionary = currentText();
    calendarContainer.innerHTML = `
      ${dictionary.weekDays.map((day) => `<div class="calendar-head">${day}</div>`).join('')}
    ` + dashboard.upcomingDays.map((day) => `
      <div class="calendar-day ${day.reservas > 0 ? 'active-day' : ''}">
        <strong>${day.fecha.slice(8)}</strong><br>
        <small>${day.reservas} ${dictionary.bookings}</small>
      </div>
    `).join('');

    reservationsContainer.innerHTML = dashboard.reservationsToday.length
      ? dashboard.reservationsToday.map((reservation) => `
        <div class="soft-panel mb-3">
          <p class="mb-1 fw-semibold">${reservation.codigoReserva}</p>
          <p class="text-muted mb-1">${reservation.habitacion} | ${reservation.cliente}</p>
          <p class="text-muted mb-0">${reservation.observaciones || dictionary.noOperationalNotes}</p>
        </div>
      `).join('')
      : `<div class="soft-panel">${dictionary.noCurrentBookings}</div>`;

    tasksContainer.innerHTML = dashboard.reservationsToday.length
      ? dashboard.reservationsToday.map((reservation) => `
        <tr>
          <td>${reservation.habitacion}</td>
          <td>${reservation.cliente}</td>
          <td>${reservation.observaciones || dictionary.generalFollowUp}</td>
          <td>${reservation.fechaEntrada}</td>
        </tr>
      `).join('')
      : `<tr><td colspan="4">${dictionary.noTasks}</td></tr>`;
  } catch (error) {
    showMessage(error.message, true);
  }
}

loadWorkerDashboard();