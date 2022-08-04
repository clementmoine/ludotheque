import type { FC } from 'react';
import classNames from 'classnames';

import Color, { getTheme } from 'types/color';

import Typography from 'components/Typography';

import styles from './Spinner.module.scss';

export interface SpinnerProps {
  color?: Color;
  label?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Spinner: FC<SpinnerProps> = (props) => {
  const { className, label, size = 'md', color } = props;

  return (
    <span className={styles['spinner__container']}>
      <svg
        viewBox="0 0 50 50"
        style={{ color: getTheme(color) }}
        xmlns="http://www.w3.org/2000/svg"
        className={classNames(className, styles['spinner'], styles[`spinner--size-${size}`])}
      >
        <circle className={styles['spinner__path']} cx="25" cy="25" r="20" fill="none"></circle>
      </svg>

      {!!label && (
        <Typography variant="body1" element="span" className={styles['spinner__label']}>
          {label}
        </Typography>
      )}
    </span>
  );
};

Spinner.displayName = 'Spinner';

export default Spinner;
