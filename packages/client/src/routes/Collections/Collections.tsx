import { FC } from 'react';

import Typography from 'components/Typography';

import styles from './Collections.module.scss';
import Button from 'components/Button';
import Icon from 'components/Icon';
import useCollections from 'hooks/useCollections';

const Collections: FC = () => {
  const { collections } = useCollections();

  return (
    <div className={styles['collections']}>
      <header className={styles['collections__header']}>
        <div className={styles['collections__header__title']}>
          <Typography variant="title1" className={styles['collections__header__title']}>
            Collections
          </Typography>
          <Typography variant="body1">
            {`${collections?.length ?? 'Aucune'} collection${(collections?.length || 0) > 1 ? 's' : ''}`}
          </Typography>
        </div>

        <Button
          variant="icon"
          title="Cliquez pour rechercher une collection"
          className={styles['collections__header__button']}
        >
          <Icon size="24px" name="search" />
        </Button>

        <Button
          variant="icon"
          title="Cliquez pour créer une nouvelle collection"
          className={styles['collections__header__button']}
        >
          <Icon size="24px" name="plus" />
        </Button>
      </header>

      <main className={styles['collections__content']}>
        <ul className={styles['collections__items']}>
          {collections?.map((collection) => (
            <li key={collection.id} className={styles['collections__items__item']}>
              <Button
                title={collection.label}
                to={`/collections/${collection.id}`}
                className={styles['collections__items__item__button']}
              >
                <Icon
                  size="64px"
                  name={collection.icon}
                  className={styles['collections__items__item__icon']}
                />
              </Button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

Collections.displayName = 'Collections';

export default Collections;
