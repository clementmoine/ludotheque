import { FC, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { LocationState } from 'routes';

import Icon from 'components/Icon';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Typography from 'components/Typography';

import useAuth from 'hooks/useAuth';
import useCollection from 'hooks/useCollection';

import styles from './Collection.module.scss';
import Input from 'components/Input';

const Collection: FC = () => {
  const [query, setQuery] = useState<string>();

  const { collectionId } = useParams();

  const { user } = useAuth();

  const { collection } = useCollection(collectionId ? parseInt(collectionId) : -1, query);

  return (
    <div className={styles['collection']}>
      <header className={styles['collection__header']}>
        <Button icon="triangle-left" variant="icon" to={'/collections'} title="Retour à la page précédente" />

        <div className={styles['collection__header__title']}>
          <Typography variant="title2" className={styles['collection__header__title__title']}>
            {collection?.label}
          </Typography>

          <Button
            variant="icon"
            title="Cliquez pour modifier cette collection"
            className={styles['collection__header__button']}
          >
            <Icon size="24px" name="pen" />
          </Button>

          <Button
            variant="icon"
            className={styles['collection__header__button']}
            title="Cliquez pour ajouter un object à cette collection"
          >
            <Icon size="24px" name="plus" />
          </Button>
        </div>

        <div className={styles['collection__header__details']}>
          <div className={styles['collection__header__details__author']}>
            <Avatar size="xs" />
            <Typography variant="body2">{`${user?.firstname} ${user?.lastname}`}</Typography>
          </div>

          <Typography variant="body2">
            {`${collection?.items?.length ?? 'Aucune'} objet${
              (collection?.items?.length || 0) > 1 ? 's' : ''
            }`}
          </Typography>
        </div>
      </header>

      <main className={styles['collection__content']}>
        <Input
          type="search"
          debounce={500}
          onChange={(filter) => {
            setQuery(filter);
          }}
          left={{ icon: 'search' }}
          placeholder="Rechercher un objet"
          className={styles['collections__content__search']}
        />

        <ul>
          {collection?.items.map((item) => {
            return (
              <li key={item.id}>
                <figure>
                  <img src={item.cover ?? ''} alt={item.title} />
                  <figcaption>{item.title}</figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
};

Collection.displayName = 'Collection';

export default Collection;
