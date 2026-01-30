import axios, { type AxiosError } from 'axios'

/* -----------------------------
   Axios Instance
------------------------------*/
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

/* -----------------------------
   Request Interceptor
   - Attach JWT token
------------------------------*/
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `${token}`
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

/* -----------------------------
   Response Interceptor
------------------------------*/
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
)

export default http

/* -----------------------------
   API Helpers
------------------------------*/

export const api = {
  signup: (data: { username: string; password: string }) =>
    http.post('/signup', data),

  signin: (data: { username: string; password: string }) =>
    http.post('/signin', data),

  createWorkflow: (data: { nodes: unknown[]; edges: unknown[] }) =>
    http.post('/workflow', data),

  updateWorkflow: (workflowId: string, data: unknown) =>
    http.put(`/workflow/${workflowId}`, data),

  getWorkflows: () =>
    http.get('/workflows'),

  getWorkflow: (workflowId: string) =>
    http.get(`/workflow/${workflowId}`),

  getWorkflowExecutions: (workflowId: string) =>
    http.get(`/workflow/executions/${workflowId}`),

  getNodes: () =>
    http.get('/nodes'),
}
