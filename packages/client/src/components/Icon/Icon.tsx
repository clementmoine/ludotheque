import { FC } from 'react';
import classNames from 'classnames';

import styles from './Icon.module.scss';
import { getTheme } from 'types/color';

export interface IconProps {
  size?: string;
  name?: string;
  color?: string;
  className?: string;
}

const Icon: FC<IconProps> = (props) => {
  const { className, size, color, name } = props;

  return (
    <span
      style={{
        '--size': size,
        color: getTheme(color),
        '--icon': `url(assets/icons/${name}.svg)`,
      }}
      className={classNames(styles['icon'], className, {
        [styles['icon--has-color']]: getTheme(color) !== undefined,
      })}
    />
  );
};

Icon.displayName = 'Icon';

export default Icon;
