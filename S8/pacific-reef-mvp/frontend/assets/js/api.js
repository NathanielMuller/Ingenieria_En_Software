export async function apiRequest(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: 'La respuesta del servidor no es valida.'
  }));

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'No fue posible completar la operacion.');
  }

  return payload.data;
}