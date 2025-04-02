import { useEffect, useRef } from 'preact/hooks';
import styles from './MessageList.module.css';
import type { Message } from '../types.js';
import { MessageItem } from './MessageItem.js';
import { TypingIndicator } from './TypingIndicator.js';
import { ErrorDisplay } from './ErrorDisplay.js';
import { EmptyState } from './EmptyState.js';

interface MessageListProps {
  messages: Message[];
  agentName: string;
  agentAvatar: string;
  isTyping: boolean;
  error: Error | null;
  onRetry: () => void;
}

export function MessageList({
  messages,
  agentName,
  agentAvatar,
  isTyping,
  error,
  onRetry,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Needed for message updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className={styles.container} ref={containerRef}>
      {error ? (
        <ErrorDisplay
          message={error.message || 'An error occurred'}
          onRetry={onRetry}
        />
      ) : messages.length === 0 && !isTyping ? (
        <EmptyState agentName={agentName} />
      ) : (
        <div className={styles.messageList}>
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              agentName={agentName}
              agentAvatar={agentAvatar}
            />
          ))}
          {isTyping && (
            <TypingIndicator agentName={agentName} agentAvatar={agentAvatar} />
          )}
        </div>
      )}
    </div>
  );
}
