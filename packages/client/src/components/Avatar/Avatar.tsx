import { useMemo } from 'react';
import classNames from 'classnames';
import type { User } from '@prisma/client';

import type { FC } from 'react';

import styles from './Avatar.module.scss';
import useAuth from 'hooks/useAuth';

export interface AvatarProps {
  user?: User;
  className?: string;
  onClick?: () => void;
  element?: keyof JSX.IntrinsicElements;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: FC<AvatarProps> = (props) => {
  const auth = useAuth();

  const { user = auth.user, className, onClick, element = 'div', size = 'md' } = props;

  const initials = useMemo(() => {
    if (!user) {
      return '';
    }

    const { firstname, lastname } = user;

    return [firstname, lastname].reduce((acc, name) => {
      if (name) {
        acc = `${acc}${name.charAt(0).toUpperCase()}`;
      }

      return acc;
    }, '');
  }, [user]);

  const Element = useMemo(() => {
    if (onClick) {
      return 'button';
    }

    return element;
  }, [onClick, element]);

  if (!user) {
    return null;
  }

  return (
    <Element
      style={{
        '--image': `url("${user.avatar}")`,
      }}
      onClick={onClick}
      className={classNames([className, styles['avatar'], { [styles[`avatar--size-${size}`]]: size }])}
    >
      <span className={styles['avatar__initials']}>{initials}</span>
    </Element>
  );
};

Avatar.displayName = 'Avatar';

export default Avatar;
