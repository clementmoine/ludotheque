import { FC } from 'react';

import Typography from 'components/Typography';

import styles from './Collections.module.scss';
import Button from 'components/Button';
import Icon from 'components/Icon';

const Collections: FC = () => {
  return (
    <div className={styles['collections']}>
      <header className={styles['collections__header']}>
        <Typography variant="title1" className={styles['collections__header__title']}>
          Collections
        </Typography>

        <Button variant="icon" className={styles['collections__header__button']}>
          <Icon size="24px" name="search" />
        </Button>

        <Button variant="icon" className={styles['collections__header__button']}>
          <Icon size="24px" name="plus" />
        </Button>
      </header>
    </div>
  );
};

Collections.displayName = 'Collections';

export default Collections;
