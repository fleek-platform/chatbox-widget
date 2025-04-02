import styles from './EmptyState.module.css';

interface EmptyStateProps {
  agentName: string;
}

export function EmptyState({ agentName }: EmptyStateProps) {
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.iconContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <title>Empty state icon</title>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <p className={styles.message}>{agentName} is ready to chat</p>
      <p className={styles.hint}>Type a message to start the conversation</p>
    </div>
  );
}
