const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Get token from localStorage ───────────────────────────────────────────────
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sdecor_token');
};

// ── Core fetch wrapper ────────────────────────────────────────────────────────
const request = async (path, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
};

// ── Convenience methods ───────────────────────────────────────────────────────
export const apiGet    = (path)         => request(path, { method: 'GET' });
export const apiPost   = (path, body)   => request(path, { method: 'POST',   body: JSON.stringify(body) });
export const apiPut    = (path, body)   => request(path, { method: 'PUT',    body: JSON.stringify(body) });
export const apiPatch  = (path, body)   => request(path, { method: 'PATCH',  body: JSON.stringify(body) });
export const apiDelete = (path)         => request(path, { method: 'DELETE' });

// ── Auth endpoints ────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (email, password)           => apiPost('/api/auth/login',    { email, password }),
  register: (name, email, password)     => apiPost('/api/auth/register', { name, email, password }),
  me:       ()                          => apiGet('/api/auth/me'),
};

// ── Package endpoints ─────────────────────────────────────────────────────────
export const packagesAPI = {
  getAll:   (params = {})  => apiGet(`/api/packages?${new URLSearchParams(params)}`),
  getBySlug:(slug)         => apiGet(`/api/packages/${slug}`),
  create:   (body)         => apiPost('/api/packages', body),
  update:   (id, body)     => apiPut(`/api/packages/${id}`, body),
  remove:   (id)           => apiDelete(`/api/packages/${id}`),
};

// ── Review endpoints ──────────────────────────────────────────────────────────
export const reviewsAPI = {
  getAll:       ()               => apiGet('/api/reviews'),
  getByPackage: (packageId)      => apiGet(`/api/reviews/${packageId}`),
  submit:       (packageId, body)=> apiPost(`/api/reviews/${packageId}`, body),
  approve:      (id)             => apiPatch(`/api/reviews/${id}/approve`, {}),
  remove:       (id)             => apiDelete(`/api/reviews/${id}`),
};

// ── Upload endpoint ───────────────────────────────────────────────────────────
// Sends multipart/form-data; no Content-Type set so browser adds the boundary.
export const uploadAPI = {
  file: async (fileObj) => {
    const token = getToken();
    const form  = new FormData();
    form.append('file', fileObj);
    const res = await fetch(`${BASE}/api/upload`, {
      method:  'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body:    form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data; // { url, publicId, resourceType, width, height, ... }
  },
};


