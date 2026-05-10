import { apiRequest } from '../api.js';
import { getLanguage, setCurrentUser } from '../session.js';

const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const authMessage = document.querySelector('#auth-message');
const demoCredentials = document.querySelector('#demo-credentials');
const redirectParam = new URLSearchParams(window.location.search).get('redirect');

const text = {
  es: {
    admin: 'Admin',
    staff: 'Trabajador',
    client: 'Cliente',
    loadingError: 'No fue posible cargar las credenciales de prueba.',
    loginSuccess: 'Inicio de sesion correcto. Redirigiendo...',
    registerSuccess: 'Cuenta creada correctamente. Redirigiendo a reserva...'
  },
  en: {
    admin: 'Admin',
    staff: 'Staff',
    client: 'Guest',
    loadingError: 'Unable to load demo credentials.',
    loginSuccess: 'Sign-in successful. Redirecting...',
    registerSuccess: 'Account created successfully. Redirecting to booking...'
  }
};

function currentText() {
  return text[getLanguage()] || text.es;
}

function showMessage(message, isError = false) {
  authMessage.className = `alert ${isError ? 'alert-danger' : 'alert-success'} mt-3`;
  authMessage.textContent = message;
  authMessage.classList.remove('d-none');
}

async function loadDemoCredentials() {
  const dictionary = currentText();
  try {
    const data = await apiRequest('/health');
    const credentials = data.demoCredentials;
    demoCredentials.innerHTML = `
      <li>${dictionary.admin}: ${credentials.admin.email} / ${credentials.admin.password}</li>
      <li>${dictionary.staff}: ${credentials.trabajador.email} / ${credentials.trabajador.password}</li>
      <li>${dictionary.client}: ${credentials.cliente.email} / ${credentials.cliente.password}</li>
    `;
  } catch (error) {
    demoCredentials.innerHTML = `<li>${dictionary.loadingError}</li>`;
  }
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  try {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role')
      })
    });

    setCurrentUser(result.user);
    showMessage(currentText().loginSuccess);
    window.location.href = redirectParam || result.redirectTo;
  } catch (error) {
    showMessage(error.message, true);
  }
});

registerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);
  try {
    const result = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        nombre: formData.get('nombre'),
        apellido: formData.get('apellido'),
        correo: formData.get('correo'),
        telefono: formData.get('telefono'),
        documento: formData.get('documento'),
        password: formData.get('password')
      })
    });

    setCurrentUser({
      id: result.user.userId,
      nombre: result.user.nombre,
      apellido: result.user.apellido,
      correo: result.user.correo,
      role: 'cliente',
      clientId: result.user.clientId
    });
    showMessage(currentText().registerSuccess);
    window.location.href = redirectParam || result.redirectTo;
  } catch (error) {
    showMessage(error.message, true);
  }
});

loadDemoCredentials();