// Dynamically support external backend host in production (e.g. Vercel, Render) or fallback to local /api proxy
const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (!envUrl) return '/api'
  const trimmed = envUrl.trim().replace(/\/+$/, '')
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const API_BASE = getApiBase()

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.message || `API error ${response.status}`)
  }

  return response.json()
}

export const api = {
  getSummary: () => fetchApi('/stats/summary'),
  getAssets: (params = '') => fetchApi(`/assets${params ? `?${params}` : ''}`),
  getAsset: (id) => fetchApi(`/assets/${id}`),
  createAsset: (data) => fetchApi('/assets', { method: 'POST', body: JSON.stringify(data) }),
  updateAsset: (id, data) => fetchApi(`/assets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAsset: (id) => fetchApi(`/assets/${id}`, { method: 'DELETE' }),

  getComplaints: (params = '') => fetchApi(`/complaints${params ? `?${params}` : ''}`),
  getComplaint: (ticket) => fetchApi(`/complaints/${ticket}`),
  createComplaint: (data) => fetchApi('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  auditReviewComplaint: (ticket, data) => fetchApi(`/complaints/${ticket}/audit-review`, { method: 'POST', body: JSON.stringify(data) }),

  requestCameraToken: (coords) => fetchApi('/verification/token', { method: 'POST', body: JSON.stringify({ coordinates: coords }) }),
  getAuditQueue: () => fetchApi('/verification/audit-queue'),

  getInspections: (params = '') => fetchApi(`/inspections${params ? `?${params}` : ''}`),
  createInspection: (data) => fetchApi('/inspections', { method: 'POST', body: JSON.stringify(data) }),

  getWorkOrders: (params = '') => fetchApi(`/work-orders${params ? `?${params}` : ''}`),
  getWorkOrder: (id) => fetchApi(`/work-orders/${id}`),
  createWorkOrder: (data) => fetchApi('/work-orders', { method: 'POST', body: JSON.stringify(data) }),
  updateWorkOrder: (id, data) => fetchApi(`/work-orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
}
