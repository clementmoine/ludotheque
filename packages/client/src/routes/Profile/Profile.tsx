import { FC, useMemo } from 'react';
import { object, string } from 'yup';
import { Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import parseAuthor from 'parse-author';

import useAuth from 'hooks/useAuth';

import { LocationState } from 'routes';

import Input from 'components/Input';
import Button from 'components/Button';
import Avatar from 'components/Avatar';
import Typography from 'components/Typography';

import pkg from '../../../package.json';

import styles from './Profile.module.scss';

const ProfileValidationSchema = object().shape({
  // avatar: mixed()
  //   .test('fileSize', 'Le fichier doit faire moins de 2Mo', (value) => {
  //     if (!value.length) return true;

  //     return value[0].size <= 2 * 1024 * 1024; // 2MB
  //   })
  //   .test('type', 'Le fichier doit être une image', (value) => {
  //     if (!value.length) return true;

  //     return value[0].type.startsWith('image/');
  //   }),
  lastName: string().required('Veuillez saisir votre nom'),
  firstName: string().required('Veuillez saisir votre prénom'),
  email: string().email('Veuillez renseigner un e-mail valide').required('Veuillez saisir votre email'),
});

const Profile: FC = () => {
  const { user, updateProfile, logout } = useAuth();

  const mutation = useMutation(updateProfile);

  const locationState = useLocation().state as LocationState;

  const author = useMemo(() => {
    if (!pkg.author) return null;

    const { name, url, email } = parseAuthor(pkg.author);

    if (url || email) {
      return (
        <Button variant="link" onClick={() => window.open(url || `mailto:${email}`, '_self')}>
          <Typography variant="body3">{name || email}</Typography>
        </Button>
      );
    }

    return name;
  }, []);

  return (
    <div className={styles['profile']}>
      <header className={styles['profile__header']}>
        <Button icon="triangle-left" variant="link" color="text" to={locationState?.from?.pathname || '/'}>
          Retour
        </Button>

        <div className={styles['profile__title']}>
          <Typography variant="title1">Mon profile</Typography>
          <Avatar />
        </div>
      </header>

      <main className={styles['profile__content']}>
        <Formik
          initialValues={{
            avatar: user!.avatar,
            firstName: user!.firstName,
            lastName: user!.lastName,
            email: user!.email,
          }}
          validationSchema={ProfileValidationSchema}
          onSubmit={(values, { setSubmitting }) =>
            mutation.mutate(values, { onSettled: () => setSubmitting(false) })
          }
        >
          {({ handleSubmit, handleReset, dirty, isValid, isSubmitting, isValidating }) => {
            return (
              <Form autoComplete="off" className={styles['profile__form']}>
                {/* <Field name="avatar" component={Input} type="file" label="Avatar" /> */}

                <Field
                  name="firstName"
                  type="string"
                  left={{ icon: 'user' }}
                  component={Input}
                  label="Prénom"
                  placeholder="Saisissez votre prénom"
                />

                <Field
                  name="lastName"
                  type="string"
                  left={{ icon: 'user' }}
                  component={Input}
                  label="Nom"
                  placeholder="Saisissez votre nom"
                />

                <Field
                  name="email"
                  type="email"
                  left={{ icon: 'at-sign' }}
                  component={Input}
                  label="Adresse e-mail"
                  placeholder="Saisissez votre nom d'utilisateur"
                />

                {mutation.isError && (
                  <Typography variant="body1" color="invalid">
                    {(mutation.error as any).message === 'Unauthorized'
                      ? 'Identifiants non valides'
                      : 'Une erreur est survenue'}
                  </Typography>
                )}

                <div className={styles['profile__form__buttons']}>
                  <Button
                    type="reset"
                    variant="outline"
                    disabled={!dirty}
                    onClick={handleReset}
                    className={styles['profile__form__buttons__item']}
                  >
                    Annuler
                  </Button>

                  <Button
                    type="submit"
                    onClick={() => handleSubmit()}
                    loading={isSubmitting || isValidating}
                    className={styles['profile__form__buttons__item']}
                    disabled={!isValid || isSubmitting || isValidating}
                  >
                    Valider
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </main>

      <footer className={styles['profile__footer']}>
        <Button variant="link" to="/password-reset">
          Changer mon mot de passe
        </Button>
        <Button variant="link" className={styles['profile__footer__delete']}>
          Supprimer mon compte
        </Button>
        <Button variant="link" onClick={() => logout()}>
          Se déconnecter
        </Button>
      </footer>

      <Typography variant="body3" align="center" className={styles['profile__version']}>
        Version {pkg.version} - {author}
      </Typography>
    </div>
  );
};

Profile.displayName = 'Profile';

export default Profile;
