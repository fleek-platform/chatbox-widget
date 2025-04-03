import type { AgentResponse, MessageResponse } from './types.js';

export class ApiClient {
  private baseUrl = 'https://api.on-fleek.app';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Fetch ElizaOS agent ID using Fleek agent ID
  async fetchAgentDetails(fleekAgentId: string): Promise<AgentResponse> {
    // Placeholder: We will replace with actual BE proxy endpoint
    const response = await fetch(
      `${this.baseUrl}/proxy/agents/${fleekAgentId}`,
      {
        headers: { 'X-API-Key': this.apiKey },
      },
    );
    if (!response.ok) throw new Error('Failed to fetch agent details');
    return response.json() as Promise<AgentResponse>;
  }

  // Send message to agent via BE proxy
  async sendMessage(
    fleekAgentId: string,
    elizaAgentId: string,
    content: string,
  ): Promise<MessageResponse> {
    // Placeholder: We will replace with actual BE proxy endpoint
    const response = await fetch(
      `${this.baseUrl}/proxy/agents/${fleekAgentId}/messages`,
      {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ elizaAgentId, content }),
      },
    );
    if (!response.ok) throw new Error('Failed to send message');
    return response.json() as Promise<MessageResponse>;
  }
}

// Dummy implementation for now
export function createDummyApiClient(): ApiClient {
  return {
    fetchAgentDetails: async (fleekAgentId: string) => ({
      elizaAgentId: `eliza-${fleekAgentId}`,
      name: 'Test Agent',
      avatar: 'https://picsum.photos/38',
    }),
    sendMessage: async (
      _fleekAgentId: string,
      _elizaAgentId: string,
      content: string,
    ) => ({
      id: Date.now().toString(),
      content: `Hi! I'm Test Agent. You said: "${content}"`,
      timestamp: Date.now(),
    }),
  } as ApiClient;
}
