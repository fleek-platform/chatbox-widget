import styles from './ChatWindow.module.css';
import { Header } from './Header';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import type { Message } from '../core/types';
import FleekLogo from './icons/FleekLogo';

interface ChatWindowProps {
  agentName: string;
  agentAvatar: string;
  agentState: 'active' | 'inactive';
  messages: Message[];
  isTyping: boolean;
  error: Error | null;
  onClose: () => void;
  onSendMessage: (content: string) => void;
  onRetry: () => void;
}

export function ChatWindow({
  agentName,
  agentState,
  agentAvatar,
  messages,
  isTyping,
  error,
  onClose,
  onSendMessage,
  onRetry,
}: ChatWindowProps) {
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
          isTyping={isTyping}
          error={error}
          onRetry={onRetry}
        />

        <ChatInput
          agentName={agentName}
          onSendMessage={onSendMessage}
          disabled={isTyping || !!error}
        />
      </div>

      <a href="https://fleek.xyz/" className={styles.footer}>
        Powered by <FleekLogo />
      </a>
    </div>
  );
}
