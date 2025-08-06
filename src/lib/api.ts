// Centralized API client for EduFlow Platform
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // Authentication methods
  async register(userData: { email: string; username: string; password: string }) {
    const response = await fetch(`${this.baseURL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async login(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${this.baseURL}/token`, {
      method: 'POST',
      body: formData
    });
    
    const data = await this.handleResponse(response);
    
    // Store token in localStorage
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    
    return data;
  }

  async logout() {
    localStorage.removeItem('access_token');
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseURL}/users/me`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Content generation methods
  async generateContent(text: string, outputType: string) {
    const response = await fetch(`${this.baseURL}/generate/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        input_text: text,
        output_type: outputType
      })
    });
    return this.handleResponse(response);
  }

  async uploadFile(file: File, outputType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('output_type', outputType);

    const token = localStorage.getItem('access_token');
    const response = await fetch(`${this.baseURL}/upload/`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${this.baseURL}/health`);
    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();
