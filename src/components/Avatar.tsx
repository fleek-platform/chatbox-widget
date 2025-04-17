import type { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { useEffect } from 'preact/hooks';
import { getAvatarUrl } from '../core/utils';
import styles from './Avatar.module.css';
import { GenericAvatar, type GenericAvatarProps } from './GenericAvatar';

export interface AvatarProps extends GenericAvatarProps {
  src: string;
  alt: string;
}

export const Avatar: FunctionComponent<AvatarProps> = ({
  src = 'avatar_1',
  alt,
  size,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  let sizeClass = styles.normal;
  if (size === 'small') {
    sizeClass = styles.small;
  } else if (size === 'large') {
    sizeClass = styles.large;
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset loading/error state when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const avatarSrc = getAvatarUrl(src);

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
    <div className={sizeClass}>
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
