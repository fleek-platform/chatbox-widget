import type { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import styles from './Avatar.module.css';
import { GenericAvatar } from './GenericAvatar';

export interface AvatarProps {
  src: string;
  alt: string;
  size: 'small' | 'normal';
  className?: string;
}

export const Avatar: FunctionComponent<AvatarProps> = ({
  src,
  alt,
  size,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const sizeClass = size === 'small' ? styles.small : styles.normal;

  const handleError = () => {
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return <GenericAvatar size={size} className={className} />;
  }

  return (
    <div className={`${styles.avatarContainer} ${sizeClass}`}>
      {isLoading && <div className={styles.spinner} />}
      <img
        src={src}
        alt={alt}
        className={`${styles.avatar} ${sizeClass} ${className}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
