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
  sender: 'user' | string;
  content: string;
  timestamp: number;
}

export type WidgetState =
  | 'INITIALIZING'
  | 'CHECKING_AGENT_STATUS'
  | 'AGENT_OFFLINE'
  | 'FETCHING_AGENT_DETAILS'
  | 'LOADING_MESSAGES'
  | 'READY'
  | 'SENDING_MESSAGE'
  | 'ERROR';

export interface AgentStatus {
  status: 'true' | 'false';
}

export interface UIComponents {
  chatbox: HTMLDivElement;
  toggleButton: HTMLButtonElement;
  chatWindow: HTMLDivElement;
  messagesContainer: HTMLDivElement;
  textarea: HTMLTextAreaElement;
  sendButton: HTMLButtonElement;
}

export type Environment = 'dev' | 'staging' | 'prod';

export interface ScriptParams {
  agentId: string | null; // Fleek agent ID from script tag
  pat: string | null; // PAT for BE proxy
  colors?: Record<string, string>; // Color overrides
  containerId?: string; // Optional ID of an existing element to render into
  env?: Environment; // Optional environment parameter
}

export interface ChatboxWidgetProps {
  agentId: string;
  pat: string;
  colors?: Record<string, string>;
  useFixedPosition?: boolean;
  env?: Environment; // Optional environment parameter
  isWidgetOpen?: boolean;
}

export interface AgentResponse {
  elizaId: string;
  name: string;
  avatar?: string;
}
