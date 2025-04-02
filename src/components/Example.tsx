import styles from './Example.module.css';

interface ExampleProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

export function Example({
  title,
  description,
  buttonText,
  onButtonClick,
}: ExampleProps) {
  return (
    <div className={styles.exampleComponent}>
      <h3 className={styles.exampleHeader}>{title}</h3>
      <p className={styles.exampleText}>{description}</p>
      <button
        type="button"
        className={styles.exampleButton}
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </div>
  );
}
