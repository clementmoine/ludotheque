import { FC, useState } from 'react';

import Typography from 'components/Typography';

import styles from './Collections.module.scss';
import Button from 'components/Button';
import Icon from 'components/Icon';
import useCollections from 'hooks/useCollections';
import Input from 'components/Input';
import { Link } from 'react-router-dom';

const Collections: FC = () => {
  const [query, setQuery] = useState<string>();

  const { collections } = useCollections(query);

  return (
    <div className={styles['collections']}>
      <header className={styles['collections__header']}>
        <div className={styles['collections__header__title']}>
          <Typography variant="title1" className={styles['collections__header__title']}>
            Collections
          </Typography>
          <Typography variant="body1">
            {`${collections?.length || 'Aucune'} collection${(collections?.length || 0) > 1 ? 's' : ''}`}
          </Typography>
        </div>

        <Button
          variant="icon"
          to="/collections/new"
          title="Cliquez pour créer une nouvelle collection"
          className={styles['collections__header__button']}
        >
          <Icon size="24px" name="plus" />
        </Button>
      </header>

      <main className={styles['collections__content']}>
        <Input
          type="search"
          debounce={200}
          onChange={(filter) => {
            setQuery(filter);
          }}
          left={{ icon: 'search' }}
          placeholder="Rechercher une collection"
          className={styles['collections__content__search']}
        />

        <ul className={styles['collections__items']}>
          {collections?.map((collection) => (
            <li
              key={collection.id}
              style={{ '--collection-color': collection.color }}
              className={styles['collections__items__item']}
            >
              <Link
                title={collection.label}
                to={`/collections/${collection.id}`}
                className={styles['collections__items__item__link']}
              >
                <Icon
                  size="64px"
                  name={collection.icon}
                  color={collection.color ? '--collection-color' : 'primary'}
                  className={styles['collections__items__item__icon']}
                />

                <Typography variant="body2">
                  {`${collection._count.items || 'Aucun'} objet${
                    (collection._count.items || 0) > 1 ? 's' : ''
                  }`}
                </Typography>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

Collections.displayName = 'Collections';

export default Collections;
