import type {
  AuthResponse,
  CheckoutRequest,
  CheckoutResponse,
  ChatRequest,
  FileContent,
  FileNode,
  InviteMemberRequest,
  Plan,
  Project,
  ProjectMember,
  Subscription,
  UpdateMemberRoleRequest,
  Usage,
  User,
} from './types';

const API_BASE = 'http://localhost:8080';

const TOKEN_KEY = 'codifyai_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message || body.error || message;
    } catch {
      // non-JSON error
    }
    const error = new Error(message) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

// ---- Auth ----
export const api = {
  signup(name: string, username: string, password: string) {
    return request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, username, password }),
    });
  },
  login(username: string, password: string) {
    return request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  getProfile() {
    return request<User>('/api/auth/me');
  },

  // ---- Projects ----
  getProjects() {
    return request<Project[]>('/api/projects');
  },
  getProject(id: number) {
    return request<Project>(`/api/projects/${id}`);
  },
  createProject(name: string) {
    return request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
  updateProject(id: number, name: string) {
    return request<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },
  deleteProject(id: number) {
    return request<void>(`/api/projects/${id}`, { method: 'DELETE' });
  },

  // ---- Members ----
  getMembers(projectId: number) {
    return request<ProjectMember[]>(`/api/projects/${projectId}/members`);
  },
  inviteMember(projectId: number, body: InviteMemberRequest) {
    return request<ProjectMember>(`/api/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  updateMemberRole(projectId: number, memberId: number, body: UpdateMemberRoleRequest) {
    return request<void>(`/api/projects/${projectId}/members/${memberId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
  removeMember(projectId: number, memberId: number) {
    return request<void>(`/api/projects/${projectId}/members/${memberId}`, {
      method: 'DELETE',
    });
  },

  // ---- Chat ----
  streamChat(body: ChatRequest, onChunk: (text: string) => void, signal?: AbortSignal) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const res = await fetch(`${API_BASE}/api/chat/stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify(body),
          signal,
        });
        if (!res.ok || !res.body) {
          throw new Error(`Chat failed (${res.status})`);
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') {
              resolve();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const text = parsed.content ?? parsed.text ?? parsed.delta ?? '';
              if (text) onChunk(text);
            } catch {
              onChunk(data);
            }
          }
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  },
  getChatHistory(projectId: number) {
    return request<{ messages: Array<{ role: string; content: string; timestamp?: string }> }>(
      `/projects/${projectId}`
    );
  },

  // ---- Files ----
  getFileTree(projectId: number) {
    return request<FileNode[]>(`/api/projects/${projectId}/files`);
  },
  getFile(projectId: number, path: string) {
    return request<FileContent>(
      `/api/projects/${projectId}/files/${encodeURIComponent(path)}?path=${encodeURIComponent(path)}`
    );
  },

  // ---- Billing ----
  getPlans() {
    return request<Plan[]>('/api/plans');
  },
  getSubscription() {
    return request<Subscription>('/api/me/subscription');
  },
  createCheckout(body: CheckoutRequest) {
    return request<CheckoutResponse>('/api/payment/checkout', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  openPortal() {
    return request<{ url: string }>('/api/payment/portal', { method: 'POST' });
  },

  // ---- Usage ----
  getTodayUsage() {
    return request<Usage>('/api/usage/today');
  },
  getPlanLimits() {
    return request<Usage>('/api/usage/limits');
  },
};
