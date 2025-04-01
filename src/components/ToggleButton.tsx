import Cross from './icons/Cross';
import Message from './icons/Message';
import styles from './ToggleButton.module.css';

interface ToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ToggleButton({ isOpen, onClick }: ToggleButtonProps) {
  return (
    <button
      type="button"
      className={styles.toggleButton}
      onClick={onClick}
      aria-label={isOpen ? 'Close Chat' : 'Open Chat'}
    >
      {isOpen ? <Cross /> : <Message />}
    </button>
  );
}
