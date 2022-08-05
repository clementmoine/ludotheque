import { FC } from 'react';
import classNames from 'classnames';

import styles from './Icon.module.scss';

export interface IconProps {
  name?: string;
  className?: string;
}

const Icon: FC<IconProps> = (props) => {
  const { className, name } = props;

  return (
    <span
      style={{
        ['--icon']: `url(assets/${name}.svg)`,
      }}
      className={classNames(styles['icon'], className)}
    />
  );
};

Icon.displayName = 'Icon';

export default Icon;
