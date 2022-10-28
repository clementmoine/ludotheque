import { Item } from '@prisma/client';
import { ChangeEvent, FC, useCallback, useState } from 'react';

import { search } from 'services/items';

import Input from 'components/Input';
import Typography from 'components/Typography';

import styles from './Search.module.scss';

const Search: FC = () => {
  const [results, setResults] = useState<Item[]>();

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

        <Input
          autoFocus
          size="sm"
          type="search"
          debounce={1000}
          onChange={handleChange}
          left={{ icon: 'search' }}
          placeholder="Rechercher un objet"
          right={{ icon: 'scan', to: '/scan' }}
          className={styles['search__header__input']}
        />
      </header>

      <main className={styles['search__content']}>
        {results?.length ? (
          results.map((result) => <p key={result.id}>{result.title}</p>)
        ) : (
          <p>Aucun résultat</p>
        )}
      </main>
    </div>
  );
};

Search.displayName = 'Search';

export default Search;
