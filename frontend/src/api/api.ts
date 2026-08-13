import axios from 'axios';

// Create API base instance (Vite proxy handles routing '/api' to 'http://localhost:8000')
const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor to append Authorization token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nagardrishti_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

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
  extracted_metadata: Record<string, any> | null;
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
  decision_threshold: number;
}

export const api = {
  submitComplaint: async (complaint: ComplaintCreate): Promise<ComplaintResponse> => {
    const { data } = await apiClient.post<ComplaintResponse>('/complaints/', complaint);
    return data;
  },
  
  listIncidents: async (params?: { department?: string; priority?: string; skip?: number; limit?: number }): Promise<IncidentResponse[]> => {
    const { data } = await apiClient.get<IncidentResponse[]>('/incidents/', { params });
    return data;
  },
  
  getIncidentDetail: async (id: string): Promise<IncidentDetailResponse> => {
    const { data } = await apiClient.get<IncidentDetailResponse>(`/incidents/${id}`);
    return data;
  },
  
  listComplaints: async (params?: { skip?: number; limit?: number }): Promise<ComplaintResponse[]> => {
    const { data } = await apiClient.get<ComplaintResponse[]>('/complaints/', { params });
    return data;
  },
  
  getSystemReady: async (): Promise<SystemReadyResponse> => {
    const { data } = await apiClient.get<SystemReadyResponse>('/ready');
    return data;
  },

  getSystemMetrics: async (): Promise<SystemMetricsResponse> => {
    const { data } = await apiClient.get<SystemMetricsResponse>('/metrics');
    return data;
  }
};
export default api;
