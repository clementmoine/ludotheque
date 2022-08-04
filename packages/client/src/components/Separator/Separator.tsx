import { FC, useMemo } from 'react';
import classNames from 'classnames';

import styles from './Separator.module.scss';
import Typography from 'components/Typography';

export interface SeparatorProps {
  label?: string;
  className?: string;
}

const Separator: FC<SeparatorProps> = (props) => {
  const { className, children } = props;

  const label = useMemo(() => {
    if (props.label) {
      return props.label;
    }

    if (typeof children === 'string') {
      return children;
    }
  }, [children, props.label]);

  return (
    <div className={classNames(styles['separator'], className)}>
      {!!label && (
        <Typography variant="body1" element="span" className={styles['separator__label']}>
          {label}
        </Typography>
      )}
    </div>
  );
};

Separator.displayName = 'Separator';

export default Separator;
