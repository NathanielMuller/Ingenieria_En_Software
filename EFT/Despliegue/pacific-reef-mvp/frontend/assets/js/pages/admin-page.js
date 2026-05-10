import { apiRequest } from '../api.js';
import { clearCurrentUser, getCurrentUser, getLanguage } from '../session.js';

const currentUser = getCurrentUser();

if (!currentUser || currentUser.role !== 'administrador') {
  const redirect = encodeURIComponent(window.location.pathname);
  window.location.replace(`/acceso.html?redirect=${redirect}`);
}

document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
  clearCurrentUser();
  window.location.href = 'index.html';
});

const dashboardMessage = document.querySelector('#admin-message');
const roomForm = document.querySelector('#admin-room-form');
const roomIdInput = document.querySelector('#room-id');
const cancelRoomEditButton = document.querySelector('#cancel-room-edit');
const metrics = {
  reservasActivas: document.querySelector('#metric-active-reservations'),
  checkInHoy: document.querySelector('#metric-checkin-today'),
  ocupacion: document.querySelector('#metric-occupancy'),
  ingresos: document.querySelector('#metric-income')
};
const reservationsBody = document.querySelector('#admin-reservations-body');
const roomsBody = document.querySelector('#admin-rooms-body');
const roomCategorySelect = document.querySelector('#room-category');
let catalogRoomsCache = [];

const text = {
  es: {
    selectCategory: 'Selecciona una categoria',
    noRooms: 'No hay habitaciones registradas.',
    guests: 'huespedes',
    save: 'Guardar',
    statuses: {
      pendiente: 'pendiente',
      confirmada: 'confirmada',
      cancelada: 'cancelada',
      finalizada: 'finalizada',
      disponible: 'disponible',
      ocupada: 'ocupada',
      mantenimiento: 'mantenimiento',
      inactiva: 'inactiva'
    },
    reservationUpdated: 'Reserva',
    updatedTo: 'actualizada a',
    signInPanel: 'Debes iniciar sesion como administrador para usar este panel.',
    signInAddRoom: 'Debes iniciar sesion como administrador para agregar habitaciones.',
    saving: 'Guardando...',
    savingChanges: 'Guardando cambios...',
    roomCreated: 'Habitacion',
    createdOk: 'creada correctamente.',
    roomUpdated: 'Habitacion',
    updatedOk: 'actualizada correctamente.',
    roomDeleted: 'Habitacion eliminada correctamente.',
    reservationDeleted: 'Reserva eliminada correctamente.',
    confirmDeleteRoom: '¿Eliminar esta habitacion? Esta accion no se puede deshacer.',
    confirmDeleteReservation: '¿Eliminar esta reserva? Esta accion no se puede deshacer.',
    loadingBookings: 'Cargando reservas recientes...'
  },
  en: {
    selectCategory: 'Select a category',
    noRooms: 'No rooms registered yet.',
    guests: 'guests',
    save: 'Save',
    statuses: {
      pendiente: 'pending',
      confirmada: 'confirmed',
      cancelada: 'cancelled',
      finalizada: 'completed',
      disponible: 'available',
      ocupada: 'occupied',
      mantenimiento: 'maintenance',
      inactiva: 'inactive'
    },
    reservationUpdated: 'Booking',
    updatedTo: 'updated to',
    signInPanel: 'You must sign in as an administrator to use this panel.',
    signInAddRoom: 'You must sign in as an administrator to add rooms.',
    saving: 'Saving...',
    savingChanges: 'Saving changes...',
    roomCreated: 'Room',
    createdOk: 'created successfully.',
    roomUpdated: 'Room',
    updatedOk: 'updated successfully.',
    roomDeleted: 'Room deleted successfully.',
    reservationDeleted: 'Booking deleted successfully.',
    confirmDeleteRoom: 'Delete this room? This action cannot be undone.',
    confirmDeleteReservation: 'Delete this booking? This action cannot be undone.',
    loadingBookings: 'Loading recent bookings...'
  }
};

function currentText() {
  return text[getLanguage()] || text.es;
}

function showMessage(message, isError = false) {
  dashboardMessage.className = `alert ${isError ? 'alert-danger' : 'alert-success'} mb-4`;
  dashboardMessage.textContent = message;
  dashboardMessage.classList.remove('d-none');
}

function renderCatalog(categories = [], rooms = []) {
  const dictionary = currentText();
  catalogRoomsCache = rooms;
  roomCategorySelect.innerHTML = `
    <option value="">${dictionary.selectCategory}</option>
    ${categories.map((category) => `<option value="${category.id}">${category.nombre}</option>`).join('')}
  `;

  if (!rooms.length) {
    roomsBody.innerHTML = `<tr><td colspan="5">${dictionary.noRooms}</td></tr>`;
    return;
  }

  roomsBody.innerHTML = rooms.map((room) => `
    <tr>
      <td>${room.numero}<br><small class="text-muted">${room.nombre}</small></td>
      <td>${room.categoria}<br><small class="text-muted">${room.capacidad} ${dictionary.guests}</small></td>
      <td><span class="soft-chip">${dictionary.statuses[room.estado] || room.estado}</span></td>
      <td>${room.precioFormateado}</td>
      <td>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-secondary" data-action="edit-room" data-room-id="${room.id}">${document.documentElement.lang === 'en' ? 'Edit' : 'Editar'}</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete-room" data-room-id="${room.id}">${document.documentElement.lang === 'en' ? 'Delete' : 'Eliminar'}</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function resetRoomForm() {
  roomForm.reset();
  roomIdInput.value = '';
  cancelRoomEditButton.classList.add('d-none');
  roomForm.querySelector('button[type="submit"]').textContent = document.documentElement.lang === 'en' ? 'Add room' : 'Agregar habitacion';
}

function startRoomEdit(roomId) {
  const room = catalogRoomsCache.find((item) => String(item.id) === String(roomId));
  if (!room) {
    return;
  }

  roomIdInput.value = room.id;
  roomForm.number.value = room.numero || '';
  roomForm.name.value = room.nombre || '';
  roomForm.categoryId.value = room.categoryId || '';
  roomForm.capacity.value = room.capacidad || '';
  roomForm.status.value = room.estado || 'disponible';
  roomForm.price.value = room.precio || '';
  roomForm.imageUrl.value = room.imagen || '';
  roomForm.description.value = room.descripcion || '';
  cancelRoomEditButton.classList.remove('d-none');
  roomForm.querySelector('button[type="submit"]').textContent = document.documentElement.lang === 'en' ? 'Save changes' : 'Guardar cambios';
  roomForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function updateReservationStatus(reservationCode, status) {
  const dictionary = currentText();
  try {
    await apiRequest(`/admin/reservations/${reservationCode}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    showMessage(`${dictionary.reservationUpdated} ${reservationCode} ${dictionary.updatedTo} ${dictionary.statuses[status] || status}.`);
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function deleteRoom(roomId) {
  const dictionary = currentText();
  if (!window.confirm(dictionary.confirmDeleteRoom)) return;
  try {
    await apiRequest(`/admin/rooms/${roomId}`, { method: 'DELETE' });
    showMessage(dictionary.roomDeleted);
    await loadDashboard();
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function deleteReservation(reservationCode) {
  const dictionary = currentText();
  if (!window.confirm(dictionary.confirmDeleteReservation)) return;
  try {
    await apiRequest(`/admin/reservations/${reservationCode}`, { method: 'DELETE' });
    showMessage(dictionary.reservationDeleted);
    await loadDashboard();
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function loadDashboard() {
  if (!currentUser || currentUser.role !== 'administrador') {
    showMessage(currentText().signInPanel, true);
    return;
  }

  try {
    const dashboard = await apiRequest('/admin/dashboard');
    metrics.reservasActivas.textContent = dashboard.metrics.reservasActivas;
    metrics.checkInHoy.textContent = dashboard.metrics.checkInHoy;
    metrics.ocupacion.textContent = `${dashboard.metrics.ocupacion}%`;
    metrics.ingresos.textContent = dashboard.metrics.ingresosConfirmadosFormateado;
    reservationsBody.innerHTML = dashboard.recentReservations.map((reservation) => `
      <tr>
        <td>${reservation.codigoReserva}</td>
        <td>${reservation.cliente}</td>
        <td>${reservation.fechaEntrada} a ${reservation.fechaSalida}</td>
        <td>
          <div class="d-flex gap-2 align-items-center flex-wrap">
            <select class="form-select form-select-sm" data-code="${reservation.codigoReserva}">
              ${['pendiente', 'confirmada', 'cancelada', 'finalizada'].map((status) => `<option value="${status}" ${status === reservation.estado ? 'selected' : ''}>${currentText().statuses[status] || status}</option>`).join('')}
            </select>
            <button class="btn btn-sm btn-light" data-action="save-status" data-code="${reservation.codigoReserva}">${currentText().save}</button>
            <button class="btn btn-sm btn-outline-danger" data-action="delete-reservation" data-code="${reservation.codigoReserva}">${document.documentElement.lang === 'en' ? 'Delete' : 'Eliminar'}</button>
          </div>
        </td>
      </tr>
    `).join('');
    renderCatalog(dashboard.roomCategories, dashboard.catalogRooms);
  } catch (error) {
    showMessage(error.message, true);
  }
}

roomForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!currentUser || currentUser.role !== 'administrador') {
    showMessage(currentText().signInAddRoom, true);
    return;
  }

  const submitButton = roomForm.querySelector('button[type="submit"]');
  const formData = new FormData(roomForm);
  const payload = Object.fromEntries(formData.entries());
  const editingRoomId = roomIdInput.value;

  submitButton.disabled = true;
  submitButton.textContent = editingRoomId ? currentText().savingChanges : currentText().saving;

  try {
    const result = await apiRequest(editingRoomId ? `/admin/rooms/${editingRoomId}` : '/admin/rooms', {
      method: editingRoomId ? 'PATCH' : 'POST',
      body: JSON.stringify(payload)
    });
    showMessage(
      editingRoomId
        ? `${currentText().roomUpdated} ${result.number} ${currentText().updatedOk}`
        : `${currentText().roomCreated} ${result.number} ${currentText().createdOk}`
    );
    resetRoomForm();
    await loadDashboard();
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = roomIdInput.value
      ? (document.documentElement.lang === 'en' ? 'Save changes' : 'Guardar cambios')
      : (document.documentElement.lang === 'en' ? 'Add room' : 'Agregar habitacion');
  }
});

cancelRoomEditButton?.addEventListener('click', () => {
  resetRoomForm();
});

reservationsBody?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  if (button.dataset.action === 'save-status') {
    const select = reservationsBody.querySelector(`select[data-code="${button.dataset.code}"]`);
    updateReservationStatus(button.dataset.code, select.value);
  }

  if (button.dataset.action === 'delete-reservation') {
    deleteReservation(button.dataset.code);
  }
});

roomsBody?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  if (button.dataset.action === 'edit-room') {
    startRoomEdit(button.dataset.roomId);
  }

  if (button.dataset.action === 'delete-room') {
    deleteRoom(button.dataset.roomId);
  }
});

loadDashboard();