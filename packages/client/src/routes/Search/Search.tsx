import { Item } from '@prisma/client';
import { useLocation } from 'react-router-dom';
import { FC, useCallback, useState } from 'react';

import { search } from 'services/items';

import { LocationState } from 'routes';

import Input from 'components/Input';
import Button from 'components/Button';
import Typography from 'components/Typography';

import styles from './Search.module.scss';
import Image from 'components/Image';
import { Field, Form, Formik } from 'formik';
import { object, string } from 'yup';

const SearchValidationSchema = object().shape({
  query: string().required('Veuillez saisir un mot clé.'),
});

const Search: FC = () => {
  const [results, setResults] = useState<Item[]>();
  const locationState = useLocation().state as LocationState;

  const handleSearch = useCallback((value: string) => {
    // if (!value.trim().length) {
    //   setResults(undefined);
    //   return Promise.resolve();
    // }
    // return search(value).then((items) => {
    //   setResults(items);
    // });
  }, []);

  return (
    <div className={styles['search']}>
      <header className={styles['search__header']}>
        <div className={styles['search__header__title']}>
          <Typography variant="title1">Rechercher</Typography>
        </div>

        <div className={styles['search__header__search']}>
          <Formik
            initialValues={{ query: locationState.previousData?.query }}
            validationSchema={SearchValidationSchema}
            onSubmit={(values) => {
              handleSearch(values.query);
            }}
          >
            <Form>
              <Field
                component={Input}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                size="sm"
                type="search"
                name="query"
                debounce={200}
                onChange={handleSearch}
                left={{ icon: 'search' }}
                placeholder="Rechercher un objet"
                right={{ icon: 'scan', to: '/scan' }}
                className={styles['search__header__search__input']}
              />

              <Button variant="link" type="reset" color="text" to={locationState?.from?.pathname || '/'}>
                Annuler
              </Button>
            </Form>
          </Formik>
        </div>
      </header>

      <main className={styles['search__content']}>
        {results?.length ? (
          results.map((result) => <p key={result.id}>{result.title}</p>)
        ) : (
          <div className={styles['search__content__instruction']}>
            <Image
              src={'/assets/illustrations/search.svg'}
              className={styles['search__content__instruction__illustration']}
            />
            <Typography align="center" variant="title2">
              Retrouvez vos objets de collections
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
