export interface Agent {
  name: string;
  avatar: string;
  fleekAgentId?: string; // Fleek-provided agent ID
  elizaAgentId?: string; // ElizaOS-provided agent ID
}

export interface User {
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: number;
}

export interface UIComponents {
  chatbox: HTMLDivElement;
  toggleButton: HTMLButtonElement;
  chatWindow: HTMLDivElement;
  messagesContainer: HTMLDivElement;
  textarea: HTMLTextAreaElement;
  sendButton: HTMLButtonElement;
}

export interface ScriptParams {
  agentId: string | null; // Fleek agent ID from script tag
  apiKey: string | null; // API key for BE proxy
}

export interface AgentResponse {
  elizaAgentId: string;
  name: string;
  avatar?: string;
}

export interface MessageResponse {
  id: string;
  content: string;
  timestamp: number;
}
