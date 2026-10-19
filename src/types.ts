export type ID = number;

export interface User {
  id: ID;
  username: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Project {
  id: ID;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectRequest {
  name: string;
}

export type MemberRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface ProjectMember {
  id: ID;
  username: string;
  name?: string;
  role: MemberRole;
}

export interface InviteMemberRequest {
  username: string;
  role: MemberRole;
}

export interface UpdateMemberRoleRequest {
  role: MemberRole;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  projectId: ID;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export interface FileContent {
  path: string;
  content: string;
}

export interface Plan {
  id: ID;
  name: string;
  price: number;
  interval: string;
  features: string[];
  messageLimit?: number;
  projectLimit?: number;
  popular?: boolean;
}

export interface Subscription {
  planId: ID;
  planName: string;
  status: string;
  currentPeriodEnd?: string;
}

export interface Usage {
  messagesUsed: number;
  messageLimit: number;
  projectsUsed?: number;
  projectLimit?: number;
}

export interface CheckoutRequest {
  planId: ID;
}

export interface CheckoutResponse {
  url: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
