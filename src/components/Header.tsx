import { Avatar } from './Avatar';
import styles from './Header.module.css';
import Cross from './icons/Cross';

interface HeaderProps {
  agentName: string;
  agentAvatar: string;
  agentState: 'active' | 'inactive';
  onClose: () => void;
}

export function Header({
  agentName,
  agentAvatar,
  agentState = 'inactive',
  onClose,
}: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleContainer}>
        <Avatar src={agentAvatar} alt={`${agentName}'s avatar`} size="small" />
        <span className={styles.title}>{agentName}</span>
        <span
          className={
            agentState === 'active'
              ? styles.statusBadge
              : styles.statusBadgeOffline
          }
        >
          {agentState === 'active' ? 'live' : 'offline'}
        </span>
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
