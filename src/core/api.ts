import type { AgentResponse, AgentStatus } from './types.js';

const ENDPOINTS = {
  aiAgentStatus: 'api/v1/ai-agents/:id/status',
  aiAgentDetails: 'api/v1/ai-agents/:id',
  aiAgentMessage: 'api/v1/ai-agents/:id/api/:elizaId/message',
  aiAgentProxy: 'api/v1/ai-agents/:id/api/agents',
};

interface ICreateApiClient {
  baseUrl: string;
  pat: string;
  fleekAgentId: string;
}

export const createApiClient = ({
  baseUrl,
  pat,
  fleekAgentId,
}: ICreateApiClient) => {
  if (!baseUrl || !pat || !fleekAgentId) return;

  const fetchAgentStatus = async (): Promise<AgentStatus> => {
    const response = await fetch(
      `${baseUrl}/${ENDPOINTS.aiAgentStatus.replace(':id', fleekAgentId)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${pat}`,
          'X-API-Key': pat,
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
      `${baseUrl}/${ENDPOINTS.aiAgentMessage.replace(':id', fleekAgentId).replace(':elizaId', elizaId)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pat}`,
          'X-API-Key': pat,
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
    const responseAgent = await fetch(
      `${baseUrl}/${ENDPOINTS.aiAgentProxy.replace(':id', fleekAgentId)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${pat}`,
          'X-API-Key': pat,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!responseAgent.ok) throw new Error('Failed to fetch agent details');

    const agentData = await responseAgent.json();
    const elizaId = agentData.agents[0].id;
    console.log('🚀 ~ fetchAgentDetails ~ agentData:', agentData);

    const responseAgentDetails = await fetch(
      `${baseUrl}/${ENDPOINTS.aiAgentDetails.replace(':id', fleekAgentId)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${pat}`,
          'X-API-Key': pat,
          'Content-Type': 'application/json',
        },
      },
    );

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
