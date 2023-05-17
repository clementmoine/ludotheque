import classNames from 'classnames';
import { Item } from '@prisma/client';
import { FC, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Icon from 'components/Icon';
import Image from 'components/Image';
import Button from 'components/Button';
import Typography from 'components/Typography';

import { LocationState } from 'routes';

import styles from './CollectionItem.module.scss';

export interface CollectionItemProps extends React.HTMLAttributes<HTMLElement> {
  item: Item;
}

const CollectionItem: FC<CollectionItemProps> = (props) => {
  const { item } = props;

  return (
    <div className={styles['collection-item']}>
      <Image
        alt={item.title}
        title={item.title}
        src={item.cover ?? ''}
        className={styles['collection-item__image']}
      />

      <div className={styles['collection-item__details']}>
        <Typography variant="body1" className={styles['collection-item__title']}>
          {item.title}
        </Typography>
      </div>

      <Button variant="icon" icon="menu-vertical" className={styles['collection-item__menu']} />
    </div>
  );
};

CollectionItem.displayName = 'CollectionItem';

export default CollectionItem;
