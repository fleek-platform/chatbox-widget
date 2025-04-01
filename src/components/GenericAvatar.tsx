import type { FunctionComponent } from 'preact';
import styles from './GenericAvatar.module.css';
import Silhouette from './icons/Silhouette';

export interface GenericAvatarProps {
  size: 'small' | 'normal';
  className?: string;
}

export const GenericAvatar: FunctionComponent<GenericAvatarProps> = ({
  size,
  className = '',
}) => {
  const sizeClass = size === 'small' ? styles.small : styles.normal;
  return (
    <div className={`${styles.avatar} ${sizeClass} ${className}`}>
      <Silhouette />
    </div>
  );
};
