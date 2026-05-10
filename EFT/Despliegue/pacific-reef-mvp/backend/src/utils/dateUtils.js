const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function parseIsoDate(dateText) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText || '')) {
    return null;
  }

  const date = new Date(`${dateText}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function differenceInDays(startDateText, endDateText) {
  const startDate = parseIsoDate(startDateText);
  const endDate = parseIsoDate(endDateText);

  if (!startDate || !endDate) {
    return NaN;
  }

  return Math.round((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}