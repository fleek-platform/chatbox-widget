import type { WidgetState } from '../core/types';
import styles from './LoadingState.module.css';

interface LoadingStateProps {
  widgetState: WidgetState;
}

export function LoadingState({ widgetState }: LoadingStateProps) {
  const stateMessages: Record<string, string> = {
    CHECKING_AGENT_STATUS: 'Checking if agent is online...',
    FETCHING_AGENT_DETAILS: 'Loading agent profile...',
    LOADING_MESSAGES: 'Preparing chat history...',
  };

  const message = stateMessages[widgetState] || 'Initializing...';

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}
