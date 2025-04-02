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
    <div className={styles.typingIndicator}>
      <img
        src={agentAvatar}
        alt={`${agentName}'s avatar`}
        className={styles.avatar}
      />
      <div className={styles.bubble}>
        <span className={styles.text}>
          {agentName} is typing
          <span className={styles.dots}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </span>
      </div>
    </div>
  );
}
