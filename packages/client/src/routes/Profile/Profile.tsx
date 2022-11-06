import { object, string } from 'yup';
import parseAuthor from 'parse-author';
import { Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';
import React, { ChangeEvent, FC, useCallback, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

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
  lastname: string().required('Veuillez saisir votre nom.'),
  firstname: string().required('Veuillez saisir votre prénom.'),
  email: string().email('Veuillez renseigner un e-mail valide.').required('Veuillez saisir votre email.'),
});

const Profile: FC = () => {
  const { user, updateProfile, logout, changeAvatar } = useAuth();

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

  const handleDeleteAvatar = useCallback(() => {
    changeAvatar(null);
  }, [changeAvatar]);

  const handleUploadAvatar = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (event: unknown) => {
      const files = (event as ChangeEvent<HTMLInputElement>).currentTarget?.files;

      if (!files?.length) {
        return;
      }

      changeAvatar(files[0]);
    };

    input.click();
  }, [changeAvatar]);

  return (
    <div className={styles['profile']}>
      <header className={styles['profile__header']}>
        <Button icon="triangle-left" variant="link" color="text" to="/">
          Retour
        </Button>

        <div className={styles['profile__title']}>
          <Typography variant="title1">Mon profile</Typography>

          <div className={styles['profile__header__avatar']}>
            <Button
              icon="pen"
              color="white"
              title="Cliquez pour changer l'image"
              onClick={handleUploadAvatar}
              className={styles['profile__header__avatar__edit-button']}
            />

            {user?.avatar != null && (
              <Button
                icon="close"
                color="white"
                title="Cliquez pour supprimer l'image"
                onClick={handleDeleteAvatar}
                className={styles['profile__header__avatar__remove-button']}
              />
            )}

            <Avatar className={styles['profile__header__avatar__image']} />
          </div>
        </div>
      </header>

      <main className={styles['profile__main']}>
        <Formik
          initialValues={{
            firstname: user!.firstname,
            lastname: user!.lastname,
            email: user!.email,
          }}
          validationSchema={ProfileValidationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            mutation.mutate(values, {
              onSettled: () => setSubmitting(false),
              onSuccess: (updatedValues) => {
                resetForm({ values: updatedValues });
              },
            });
          }}
        >
          {({ handleSubmit, handleReset, dirty, isValid, isSubmitting, isValidating }) => {
            return (
              <Form autoComplete="off" className={styles['profile__form']}>
                {/* <Field name="avatar" component={Input} type="file" label="Avatar" /> */}

                <Field
                  name="firstname"
                  type="string"
                  left={{ icon: 'user' }}
                  component={Input}
                  label="Prénom"
                  placeholder="Saisissez votre prénom"
                />

                <Field
                  name="lastname"
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
                      ? 'Identifiants non valides.'
                      : 'Une erreur est survenue.'}
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

        <div className={styles['profile__actions']}>
          <Button variant="link" to="/password-reset">
            Changer mon mot de passe
          </Button>
          <Button variant="link" className={styles['profile__actions__delete']}>
            Supprimer mon compte
          </Button>
          <Button variant="link" onClick={() => logout()}>
            Se déconnecter
          </Button>
        </div>

        <Typography variant="body3" align="center" className={styles['profile__version']}>
          Version {pkg.version} - {author}
        </Typography>
      </main>
    </div>
  );
};

Profile.displayName = 'Profile';

export default Profile;
