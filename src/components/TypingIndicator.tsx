import { Avatar } from './Avatar';
import styles from './TypingIndicator.module.css';

interface TypingIndicatorProps {
  agentName: string;
  agentAvatar: string;
}

export function TypingIndicator({
  agentName,
  agentAvatar,
}: TypingIndicatorProps) {
  return (
    <div className={styles.messageItem}>
      <Avatar src={agentAvatar} alt={`${agentName}'s avatar`} size="normal" />
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <span className={styles.name}>{agentName}</span>
        </div>
        <div className={styles.typingContent}>the agent is typing...</div>
      </div>
    </div>
  );
}
