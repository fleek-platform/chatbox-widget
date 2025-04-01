import { useRef, useState } from 'preact/hooks';
import styles from './ChatInput.module.css';
import PaperPlane from './icons/PaperPlane';

interface ChatInputProps {
  agentName: string;
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({
  agentName,
  onSendMessage,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const content = message.trim();
    if (!content || disabled) return;

    onSendMessage(content);
    setMessage('');

    // Focus back on textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.inputContainer}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        placeholder={`Message ${agentName}...`}
        value={message}
        onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
      />
      <button
        type="button"
        className={styles.sendButton}
        onClick={handleSubmit}
        disabled={!message.trim() || disabled}
        aria-label="Send message"
      >
        <PaperPlane />
      </button>
    </div>
  );
}
