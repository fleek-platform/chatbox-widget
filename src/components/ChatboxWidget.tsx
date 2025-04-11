import { useCallback, useEffect, useState } from 'preact/hooks';
import { createApiClient } from '../core/api.js';
import type {
  ChatboxWidgetProps,
  Message,
  WidgetState,
} from '../core/types.js';
import {
  getApiBaseUrl,
  loadMessages,
  loadRoomId,
  saveMessages,
  saveRoomId,
} from '../core/utils.js';
import { ChatWindow } from './ChatWindow.js';
import styles from './ChatboxWidget.module.css';
import { ToggleButton } from './ToggleButton.js';
import { v4 as uuid } from 'uuid';

export function ChatboxWidget({
  agentId,
  token,
  colors,
  useFixedPosition = true,
  restApiHost,
  isWidgetOpen = false,
}: ChatboxWidgetProps) {
  const [isOpen, setIsOpen] = useState(isWidgetOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [widgetState, setWidgetState] = useState<WidgetState>('INITIALIZING');
  const [agent, setAgent] = useState({
    name: '',
    avatar: '',
    elizaId: '',
  });
  const [roomId, setRoomId] = useState<string>('');
  const [apiClient] = useState(() =>
    createApiClient({
      fleekAgentId: agentId,
      token,
      baseUrl: getApiBaseUrl(restApiHost),
    }),
  );

  const initializeRoomId = useCallback(() => {
    console.log(
      'State: INITIALIZING -> CHECKING_AGENT_STATUS (via initializeRoomId)',
    );
    let savedRoomId = loadRoomId();
    if (savedRoomId) {
      setRoomId(savedRoomId);
    } else {
      savedRoomId = uuid();
      saveRoomId(savedRoomId);
      setRoomId(savedRoomId);
    }
    // Trigger the next step in the effect
    setWidgetState('CHECKING_AGENT_STATUS');
  }, []);

  const checkAgentStatus = useCallback(async () => {
    if (!apiClient) return;
    console.log('State: CHECKING_AGENT_STATUS');
    setError(null);
    try {
      const { status } = await apiClient.fetchAgentStatus();
      console.log('🚀 ~ checkAgentStatus ~ status:', status);
      if (status === 'true') {
        console.log('State: CHECKING_AGENT_STATUS -> FETCHING_AGENT_DETAILS');
        setWidgetState('FETCHING_AGENT_DETAILS');
      } else {
        console.log('State: CHECKING_AGENT_STATUS -> AGENT_OFFLINE');
        setWidgetState('AGENT_OFFLINE');
      }
    } catch (err) {
      console.error('Error fetching agent status:', err);
      setError(err as Error);
      console.log('State: CHECKING_AGENT_STATUS -> ERROR');
      setWidgetState('ERROR');
    }
  }, [apiClient]);

  const fetchAgentDetails = useCallback(async () => {
    if (!apiClient) return;
    console.log('State: FETCHING_AGENT_DETAILS');
    setError(null);
    try {
      const agentData = await apiClient.fetchAgentDetails();
      console.log('🚀 ~ fetchAgentDetails ~ agentData:', agentData);
      setAgent({
        name: agentData.name,
        avatar: agentData.avatar || 'https://picsum.photos/38',
        elizaId: agentData.elizaId,
      });
      console.log('State: FETCHING_AGENT_DETAILS -> LOADING_MESSAGES');
      setWidgetState('LOADING_MESSAGES');
    } catch (err) {
      console.error('Error fetching agent details:', err);
      setError(err as Error);
      console.log('State: FETCHING_AGENT_DETAILS -> ERROR');
      setWidgetState('ERROR');
    }
  }, [apiClient]);

  const loadChatMessages = useCallback(() => {
    console.log('State: LOADING_MESSAGES');
    if (!roomId) {
      console.error('Room ID not set, cannot load messages');
      setError(new Error('Room ID not available'));
      setWidgetState('ERROR');
      return;
    }
    const savedMessages = loadMessages(agentId, roomId);
    setMessages(savedMessages);
    console.log('State: LOADING_MESSAGES -> READY');
    setWidgetState('READY');
  }, [agentId, roomId]);

  // Effect to manage state transitions
  useEffect(() => {
    if (!isOpen || !apiClient) return;

    switch (widgetState) {
      case 'INITIALIZING':
        initializeRoomId();
        break;
      case 'CHECKING_AGENT_STATUS':
        checkAgentStatus();
        break;
      case 'FETCHING_AGENT_DETAILS':
        fetchAgentDetails();
        break;
      case 'LOADING_MESSAGES':
        loadChatMessages();
        break;
      // Other states are handled by user actions or previous steps
    }
  }, [
    isOpen,
    widgetState,
    apiClient,
    initializeRoomId,
    checkAgentStatus,
    fetchAgentDetails,
    loadChatMessages,
  ]);

  const toggleChat = () => {
    const nextIsOpen = !isOpen;
    setIsOpen(nextIsOpen);
    if (!nextIsOpen) {
      // Reset state when closing
      console.log('Chat closed, resetting state to INITIALIZING');
      setWidgetState('INITIALIZING');
      setError(null);
      // Optionally clear messages or keep them for next open
      // setMessages([]);
    } else if (widgetState === 'INITIALIZING') {
      // Trigger initial load when opening if state is INITIALIZING
      initializeRoomId();
    }
  };

  const handleRetry = () => {
    console.log('Retry clicked, current state:', widgetState);
    setError(null); // Clear previous error
    // Determine which action to retry based on the state where the error likely occurred
    // This logic might need refinement based on how errors are specifically tracked
    if (widgetState === 'AGENT_OFFLINE') {
      setWidgetState('CHECKING_AGENT_STATUS'); // Retry checking status
    } else if (widgetState === 'ERROR') {
      // Assuming error happened during fetchAgentDetails or checkAgentStatus
      // A more robust solution might store the state *before* the error
      setWidgetState('CHECKING_AGENT_STATUS'); // Default retry: start from status check
    }
  };

  const sendMessage = async (content: string) => {
    console.log('🚀 ~ sendMessage ~ agent:', agent);
    if (
      !content.trim() ||
      !agent.elizaId ||
      !apiClient ||
      widgetState !== 'READY'
    )
      return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    saveMessages(agentId, roomId, updatedMessages);
    setMessages(updatedMessages);

    console.log('State: READY -> SENDING_MESSAGE');
    setWidgetState('SENDING_MESSAGE');
    setError(null);

    try {
      const response = await apiClient.sendMessage(
        'user',
        roomId,
        agent.elizaId,
        content,
      );

      const agentMessage: Message = {
        id: Date.now().toString(),
        sender: agent.name,
        content: response,
        timestamp: Date.now(),
      };
      console.log('🚀 ~ sendMessage ~ agentMessage:', agentMessage);

      const finalMessages = [...updatedMessages, agentMessage];
      setMessages(finalMessages);
      saveMessages(agentId, roomId, finalMessages);
      console.log('State: SENDING_MESSAGE -> READY');
      setWidgetState('READY');
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err as Error);
      console.log('State: SENDING_MESSAGE -> ERROR');
      setWidgetState('ERROR');
    }
  };

  return (
    <div
      className={`${styles.chatboxWidget} ${useFixedPosition ? styles.fixedPosition : ''}`}
    >
      <ToggleButton isOpen={isOpen} onClick={toggleChat} />

      {isOpen && (
        <ChatWindow
          agentName={agent.name || 'Agent'}
          agentAvatar={agent.avatar || 'avatar_1'}
          widgetState={widgetState}
          isTyping={widgetState === 'SENDING_MESSAGE'}
          messages={messages}
          error={error}
          onClose={toggleChat}
          onSendMessage={sendMessage}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
