import axios from 'axios';

// Create API base instance (Vite proxy handles routing '/api' to 'http://localhost:8000')
const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor to append Bearer token if present in localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nagardrishti_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear all auth state on 401/403
      localStorage.removeItem('nagardrishti_token');
      localStorage.removeItem('nagardrishti_role');
      localStorage.removeItem('nagardrishti_username');
      // Trigger a page reload to reset the application state to default
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export interface ComplaintCreate {
  raw_text: string;
  location?: string;
  image_url?: string;
}

export interface ComplaintResponse {
  id: string;
  raw_text: string;
  location: string | null;
  image_url: string | null;
  incident_id: string | null;
  extracted_metadata: {
    department?: string;
    issue_type?: string;
    priority?: string;
    location?: string;
    summary?: string;
  } | null;
  created_at: string;
}

export interface IncidentResponse {
  id: string;
  title: string;
  department: string;
  issue_type: string;
  priority: string;
  location: string | null;
  summary: string | null;
  created_at: string;
}

export interface IncidentDetailResponse extends IncidentResponse {
  complaints: ComplaintResponse[];
  duplicate_count: number;
}

export interface SystemReadyResponse {
  status: string;
  dependencies: {
    database: boolean;
    qdrant: boolean;
    gemini: boolean;
  };
}

export interface SystemMetricsResponse {
  app_uptime_seconds: number;
  prompt_version: string;
  embedding_model: string;
  embedding_dimensions?: number;
  decision_threshold: number;
  llm_model?: string;
}

export type UserRole = 'CITIZEN' | 'OFFICER' | 'ADMIN' | 'EVALUATOR';

export interface UserSession {
  token: string;
  role: UserRole;
  username: string;
}

export const api = {
  // Authentication Session Storage
  setToken: (token: string, role: UserRole, username: string = 'User') => {
    localStorage.setItem('nagardrishti_token', token);
    localStorage.setItem('nagardrishti_role', role);
    localStorage.setItem('nagardrishti_username', username);
  },
  
  clearToken: () => {
    localStorage.removeItem('nagardrishti_token');
    localStorage.removeItem('nagardrishti_role');
    localStorage.removeItem('nagardrishti_username');
  },

  getSession: (): UserSession | null => {
    const token = localStorage.getItem('nagardrishti_token');
    const role = (localStorage.getItem('nagardrishti_role') as UserRole) || 'EVALUATOR';
    const username = localStorage.getItem('nagardrishti_username') || 'SIH Evaluator';
    if (!token) return null;
    return { token, role, username };
  },

  // Complaints
  submitComplaint: async (complaint: ComplaintCreate): Promise<ComplaintResponse> => {
    const { data } = await apiClient.post<ComplaintResponse>('/complaints/', complaint);
    return data;
  },
  
  listComplaints: async (params?: { skip?: number; limit?: number }): Promise<ComplaintResponse[]> => {
    const { data } = await apiClient.get<ComplaintResponse[]>('/complaints/', { params });
    return data;
  },

  // Incidents
  listIncidents: async (params?: { department?: string; priority?: string; skip?: number; limit?: number }): Promise<IncidentResponse[]> => {
    const { data } = await apiClient.get<IncidentResponse[]>('/incidents/', { params });
    return data;
  },
  
  getIncidentDetail: async (id: string): Promise<IncidentDetailResponse> => {
    const { data } = await apiClient.get<IncidentDetailResponse>(`/incidents/${id}`);
    return data;
  },

  // Monitoring & Health
  getSystemReady: async (): Promise<SystemReadyResponse> => {
    const { data } = await apiClient.get<SystemReadyResponse>('/ready');
    return data;
  },

  getSystemMetrics: async (): Promise<SystemMetricsResponse> => {
    const { data } = await apiClient.get<SystemMetricsResponse>('/metrics');
    return {
      ...data,
      embedding_dimensions: data.embedding_dimensions || 768,
      llm_model: data.llm_model || 'gemini-1.5-flash'
    };
  }
};

export default api;
