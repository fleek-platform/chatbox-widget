import { Avatar } from './Avatar';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  agentName: string;
  agentAvatar: string;
}

export function EmptyState({ agentName, agentAvatar }: EmptyStateProps) {
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.iconContainer}>
        <Avatar src={agentAvatar} alt="Agent avatar" size="large" />
      </div>
      <p className={styles.message}>{agentName} is ready to chat</p>
      <p className={styles.hint}>Type a message to start the conversation</p>
    </div>
  );
}
