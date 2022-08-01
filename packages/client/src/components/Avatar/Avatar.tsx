import { useMemo } from 'react';
import classNames from 'classnames';

import type { FC } from 'react';

import styles from './Avatar.module.scss';
import useAuth from 'hooks/useAuth';

export interface AvatarProps {
  user?: User;
  className?: string;
  onClick?: () => void;
  container?: keyof JSX.IntrinsicElements;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: FC<AvatarProps> = (props) => {
  const auth = useAuth();

  const { user = auth.user, className, onClick, container = 'div', size = 'md' } = props;

  const initials = useMemo(() => {
    if (!user) {
      return '';
    }

    const { firstName, lastName } = user;

    return [firstName, lastName].reduce((acc, name) => {
      if (name) {
        acc = `${acc}${name.charAt(0).toUpperCase()}`;
      }

      return acc;
    }, '');
  }, [user]);

  const Container = useMemo(() => {
    if (onClick) {
      return 'button';
    }

    return container;
  }, [onClick, container]);

  if (!user) {
    return null;
  }

  return (
    <Container
      style={{
        '--image': `url("${user.avatar}")`,
      }}
      onClick={onClick}
      className={classNames([className, styles['avatar'], { [styles[`avatar--${size}`]]: size }])}
    >
      <span className={styles['avatar__initials']}>{initials}</span>
    </Container>
  );
};

Avatar.displayName = 'Avatar';

export default Avatar;
