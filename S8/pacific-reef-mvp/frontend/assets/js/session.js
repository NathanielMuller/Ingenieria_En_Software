const USER_KEY = 'pacificReef.currentUser';
const SEARCH_KEY = 'pacificReef.search';
const LANGUAGE_KEY = 'pacificReef.language';

export function getCurrentUser() {
  const rawValue = localStorage.getItem(USER_KEY);
  return rawValue ? JSON.parse(rawValue) : null;
}

export function setCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(USER_KEY);
}

export function getSearchContext() {
  const rawValue = sessionStorage.getItem(SEARCH_KEY);
  return rawValue ? JSON.parse(rawValue) : null;
}

export function setSearchContext(searchContext) {
  sessionStorage.setItem(SEARCH_KEY, JSON.stringify(searchContext));
}

export function mergeSearchContext(urlSearchParams) {
  const searchContext = getSearchContext() || {};

  for (const [key, value] of urlSearchParams.entries()) {
    if (value) {
      searchContext[key] = value;
    }
  }

  return searchContext;
}

export function buildUrl(path, parameters = {}) {
  const url = new URL(path, window.location.origin);

  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return `${url.pathname}${url.search}`;
}

export function getLanguage() {
  return localStorage.getItem(LANGUAGE_KEY) || 'es';
}

export function setLanguage(language) {
  localStorage.setItem(LANGUAGE_KEY, language);
}