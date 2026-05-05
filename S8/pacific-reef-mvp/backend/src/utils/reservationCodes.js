export function buildReservationCode() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RES-${stamp}-${randomSuffix}`;
}

export function buildTicketCode() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TCK-${stamp}-${randomSuffix}`;
}