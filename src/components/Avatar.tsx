import type { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { useEffect } from 'preact/hooks';
import { isValidUrl } from '../core/utils';
import styles from './Avatar.module.css';
import { GenericAvatar } from './GenericAvatar';

export interface AvatarProps {
  src: string;
  alt: string;
  size: 'small' | 'normal';
  className?: string;
}

export const Avatar: FunctionComponent<AvatarProps> = ({
  src = 'avatar_1',
  alt,
  size,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const sizeClass = size === 'small' ? styles.small : styles.normal;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset loading/error state when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const avatarSrc = isValidUrl(src)
    ? src
    : `https://fleek.xyz/eliza/images/avatars/${src}.webp`;

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
        key={avatarSrc}
        src={avatarSrc}
        alt={alt}
        className={`${styles.avatar} ${sizeClass} ${className}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
