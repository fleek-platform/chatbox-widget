import { useState, useEffect } from 'preact/hooks';
import styles from './ChatboxWidget.module.css';
import { ToggleButton } from './ToggleButton.js';
import { ChatWindow } from './ChatWindow.js';
import type { Message } from '../core/types.js';
import { type ApiClient, createDummyApiClient } from '../core/api.js';
import { loadMessages, saveMessages } from '../core/utils.js';

interface ChatboxWidgetProps {
  agentId: string;
  apiKey: string;
  colors?: Record<string, string>;
  useFixedPosition?: boolean;
}

export function ChatboxWidget({
  agentId,
  apiKey,
  colors,
  useFixedPosition = true,
}: ChatboxWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [agent, setAgent] = useState({
    name: 'Agent',
    avatar: 'https://picsum.photos/38',
    elizaAgentId: '',
  });
  const [apiClient] = useState<ApiClient>(() => createDummyApiClient());

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const savedMessages = loadMessages(agentId);
    setMessages(savedMessages);

    fetchAgentDetails();
  }, [agentId]);

  const fetchAgentDetails = async () => {
    setError(null);
    try {
      const agentData = await apiClient.fetchAgentDetails(agentId);
      setAgent({
        name: agentData.name,
        avatar: agentData.avatar || 'https://picsum.photos/38',
        elizaAgentId: agentData.elizaAgentId,
      });
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching agent details:', err);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !agent.elizaAgentId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(agentId, updatedMessages);

    setIsTyping(true);
    setError(null);

    try {
      const response = await apiClient.sendMessage(
        agentId,
        agent.elizaAgentId,
        content,
      );

      const agentMessage: Message = {
        id: response.id,
        sender: 'agent',
        content: response.content,
        timestamp: response.timestamp,
      };

      const finalMessages = [...updatedMessages, agentMessage];
      setMessages(finalMessages);
      saveMessages(agentId, finalMessages);
    } catch (err) {
      setError(err as Error);
      console.error('Error sending message:', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className={`${styles.chatboxWidget} ${useFixedPosition ? styles.fixedPosition : ''}`}
    >
      <ToggleButton isOpen={isOpen} onClick={toggleChat} />

      {isOpen && (
        <ChatWindow
          agentName={agent.name}
          agentAvatar={agent.avatar}
          agentState="active"
          messages={messages}
          isTyping={isTyping}
          error={error}
          onClose={toggleChat}
          onSendMessage={sendMessage}
          onRetry={fetchAgentDetails}
        />
      )}
    </div>
  );
}
