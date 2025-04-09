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

// restApiHost can be used to directly specify the API base URL
export type RestApiHost = string;

export interface ScriptParams {
  agentId: string | null; // Fleek agent ID from script tag
  token: string | null; // Token for BE proxy
  colors?: Record<string, string>; // Color overrides
  containerId?: string; // Optional ID of an existing element to render into
  restApiHost?: RestApiHost; // Optional direct API host URL
}

export interface ChatboxWidgetProps {
  agentId: string;
  token: string;
  colors?: Record<string, string>;
  useFixedPosition?: boolean;
  restApiHost?: RestApiHost; // Optional direct API host URL
  isWidgetOpen?: boolean;
}

export interface AgentResponse {
  elizaId: string;
  name: string;
  avatar?: string;
}
