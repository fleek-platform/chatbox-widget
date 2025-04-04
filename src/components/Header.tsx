import { Avatar } from './Avatar';
import styles from './Header.module.css';
import Cross from './icons/Cross';

interface HeaderProps {
  agentName: string;
  agentAvatar: string;
  agentState: 'offline' | 'live';
  onClose: () => void;
}

export function Header({
  agentName,
  agentAvatar,
  agentState = 'offline',
  onClose,
}: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleContainer}>
        <Avatar src={agentAvatar} alt={`${agentName}'s avatar`} size="small" />
        <span className={styles.title}>{agentName}</span>
        <span className={`${styles.statusBadge}`}>{agentState}</span>
      </div>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="close"
      >
        <Cross />
      </button>
    </div>
  );
}
