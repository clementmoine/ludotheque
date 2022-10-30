import { Item } from '@prisma/client';
import { useLocation } from 'react-router-dom';
import { FC, useCallback, useState } from 'react';

import { search } from 'services/items';

import { LocationState } from 'routes';

import Input from 'components/Input';
import Button from 'components/Button';
import Typography from 'components/Typography';

import styles from './Search.module.scss';

const Search: FC = () => {
  const [results, setResults] = useState<Item[]>();
  const locationState = useLocation().state as LocationState;

  const handleChange = useCallback((value: string) => {
    if (!value.trim().length) {
      setResults(undefined);

      return Promise.resolve();
    }

    return search(value).then((items) => {
      setResults(items);
    });
  }, []);

  return (
    <div className={styles['search']}>
      <header className={styles['search__header']}>
        <div className={styles['search__header__title']}>
          <Typography variant="title1">Rechercher</Typography>
        </div>

        <div className={styles['search__header__search']}>
          <Input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            size="sm"
            type="search"
            debounce={1000}
            onChange={handleChange}
            left={{ icon: 'search' }}
            placeholder="Rechercher un objet"
            right={{ icon: 'scan', to: '/scan' }}
            className={styles['search__header__search__input']}
          />

          <Button variant="link" color="text" to={locationState?.from?.pathname || '/'}>
            Annuler
          </Button>
        </div>
      </header>

      <main className={styles['search__content']}>
        {results?.length ? (
          results.map((result) => <p key={result.id}>{result.title}</p>)
        ) : (
          <div className={styles['search__content__instruction']}>
            <Typography align="center" variant="title2">
              Trouvez les objets de vos collections
            </Typography>
            <Typography align="center" variant="body1">
              Recherchez tous vos jeux, consoles, livres et bien plus encore.
            </Typography>
          </div>
        )}
      </main>
    </div>
  );
};

Search.displayName = 'Search';

export default Search;
