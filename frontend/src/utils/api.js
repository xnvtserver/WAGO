// front-end/src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}) {
  const authData = JSON.parse(
    localStorage.getItem('auth') ||
    sessionStorage.getItem('auth') ||
    '{}'
  );

  const headers = {
    'Content-Type': 'application/json',
    ...(authData.token && { Authorization: `Bearer ${authData.token}` }),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  // Remove body for GET
  if (config.method === 'GET' || config.method === undefined) {
    delete config.body;
  } else if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}
