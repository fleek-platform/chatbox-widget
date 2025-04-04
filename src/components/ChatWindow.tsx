import type { Message, WidgetState } from '../core/types';
import { ChatInput } from './ChatInput';
import styles from './ChatWindow.module.css';
import { Header } from './Header';
import { MessageList } from './MessageList';
import FleekLogo from './icons/FleekLogo';

interface ChatWindowProps {
  agentName: string;
  agentAvatar: string;
  messages: Message[];
  widgetState: WidgetState;
  isTyping: boolean;
  error: Error | null;
  onClose: () => void;
  onSendMessage: (content: string) => void;
  onRetry: () => void;
}

export function ChatWindow({
  agentName,
  widgetState,
  agentAvatar,
  messages,
  isTyping,
  error,
  onClose,
  onSendMessage,
  onRetry,
}: ChatWindowProps) {
  // Determine agent state based on widget state
  const agentState = ['READY', 'SENDING_MESSAGE'].includes(widgetState)
    ? 'live'
    : 'offline';

  // Determine if typing indicator should be shown
  const showTypingIndicator = widgetState === 'SENDING_MESSAGE' || isTyping;

  return (
    <div className={styles.chatWindow}>
      <Header
        agentName={agentName}
        agentAvatar={agentAvatar}
        agentState={agentState}
        onClose={onClose}
      />
      <div className={styles.content}>
        <MessageList
          messages={messages}
          agentName={agentName}
          agentAvatar={agentAvatar}
          isTyping={showTypingIndicator}
          error={error}
          onRetry={onRetry}
        />

        <ChatInput
          agentName={agentName}
          onSendMessage={onSendMessage}
          disabled={widgetState !== 'READY' || !!error}
        />
      </div>

      <a href="https://fleek.xyz/" className={styles.footer}>
        Powered by <FleekLogo />
      </a>
    </div>
  );
}
