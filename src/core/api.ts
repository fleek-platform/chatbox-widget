import type { AgentResponse, AgentStatus } from './types.js';

const ENDPOINTS = {
  aiAgentStatus: 'api/v1/ai-agents/:id/status',
  aiAgentDetails: 'api/v1/ai-agents/:id/public',
  aiAgentPublicDetails: 'api/v1/ai-agents/:id/public',
  aiAgentMessage: 'api/v1/ai-agents/:id/api/:elizaId/message',
  aiAgentProxy: 'api/v1/ai-agents/:id/api/agents',
};

interface ICreateApiClient {
  baseUrl: string;
  token: string;
  fleekAgentId: string;
}

export const createApiClient = ({
  baseUrl,
  token,
  fleekAgentId,
}: ICreateApiClient) => {
  if (!baseUrl || !token || !fleekAgentId) return;

  console.log('🚀 ~ baseUrl:', baseUrl);

  const normalizedBaseUrl = baseUrl.endsWith('/')
    ? baseUrl.slice(0, -1)
    : baseUrl;

  const fetchAgentStatus = async (): Promise<AgentStatus> => {
    const response = await fetch(
      `${normalizedBaseUrl}/${ENDPOINTS.aiAgentStatus.replace(':id', fleekAgentId)}`,
      {
        method: 'GET',
        headers: {
          'X-Agent-Token': token,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) throw new Error('Failed to fetch agent status');

    return await response.json();
  };

  const sendMessage = async (
    user: string,
    roomId: string,
    elizaId: string,
    message: string,
  ): Promise<string> => {
    const response = await fetch(
      `${normalizedBaseUrl}/${ENDPOINTS.aiAgentMessage.replace(':id', fleekAgentId).replace(':elizaId', elizaId)}`,
      {
        method: 'POST',
        headers: {
          'X-Agent-Token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId: user, roomId, text: message }),
      },
    );

    if (!response.ok) throw new Error('Failed to send message');
    const agentMessage = (await response.json())[0];
    return agentMessage.text;
  };

  const fetchAgentDetails = async (): Promise<AgentResponse> => {
    const responseAgentDetails = await fetch(
      `${normalizedBaseUrl}/${ENDPOINTS.aiAgentPublicDetails.replace(':id', fleekAgentId)}`,
      {
        method: 'GET',
        headers: {
          'X-Agent-Token': token,
          'Content-Type': 'application/json',
        },
      },
    );

    const responseAgent = await fetch(
      `${normalizedBaseUrl}/${ENDPOINTS.aiAgentProxy.replace(':id', fleekAgentId)}`,
      {
        method: 'GET',
        headers: {
          'X-Agent-Token': token,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!responseAgent.ok) throw new Error('Failed to fetch agent details');

    const agentData = await responseAgent.json();
    const elizaId = agentData.agents[0].id;
    console.log('🚀 ~ fetchAgentDetails ~ agentData:', agentData);

    if (!responseAgentDetails.ok)
      throw new Error('Failed to fetch agent details');

    const agentDetailsData = await responseAgentDetails.json();

    return { ...agentDetailsData, elizaId };
  };

  return {
    fetchAgentStatus,
    fetchAgentDetails,
    sendMessage,
  };
};
