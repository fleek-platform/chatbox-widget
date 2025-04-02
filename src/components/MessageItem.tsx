import styles from './MessageItem.module.css';
import type { Message } from '../types.js';
import { Avatar } from './Avatar';
import { GenericAvatar } from './GenericAvatar';

interface MessageItemProps {
  message: Message;
  agentName: string;
  agentAvatar: string;
}

export function MessageItem({
  message,
  agentName,
  agentAvatar,
}: MessageItemProps) {
  const isUserMessage = message.sender === 'user';
  const name = isUserMessage ? 'You' : agentName;
  const AvatarComponent = isUserMessage ? (
    <GenericAvatar size="normal" />
  ) : (
    <Avatar src={agentAvatar} alt={`${name}'s avatar`} size="normal" />
  );

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={styles.messageItem}>
      {AvatarComponent}
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <span className={styles.name}>{name}</span>
          <span className={styles.timestamp}>{formattedTime}</span>
        </div>
        <div className={styles.content}>{message.content}</div>
      </div>
    </div>
  );
}
