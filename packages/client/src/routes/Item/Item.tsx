import { FC } from 'react';

import styles from './Item.module.scss';

const Item: FC = () => {
  return (
    <div className={styles['item']}>
      <h1>Item</h1>
    </div>
  );
};

export default Item;
