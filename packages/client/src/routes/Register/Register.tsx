import { FC } from 'react';
import { object, string } from 'yup';
import { Formik, Field, Form } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';

import { LocationState } from 'routes';

import Input from 'components/Input';
import Button from 'components/Button';
import Separator from 'components/Separator';
import Typography from 'components/Typography';

import styles from './Register.module.scss';

const RegisterValidationSchema = object().shape({
  firstname: string().required('Veuillez saisir un prénom.'),
  lastname: string().required('Veuillez saisir un nom.'),
  email: string().required('Veuillez saisir une adresse e-mail.'),
  password: string().required('Veuillez saisir un mot de passe.'),
});

const Register: FC = () => {
  const { register } = useAuth();

  const navigate = useNavigate();

  const locationState = useLocation().state as LocationState;

  const mutation = useMutation(register, {
    onSuccess: () => {
      const redirect = locationState?.from?.pathname || '/';

      // Navigate to the home page or the previous page
      navigate(redirect);
    },
  });

  return (
    <div className={styles['register']}>
      <header className={styles['register__header']}>
        <Typography variant="title1">Démarrez votre aventure ! 💪</Typography>
        <Typography variant="body1">
          Commencez à stocker, identifier et suivre vos collections en créant un compte !
        </Typography>
      </header>

      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          email: locationState?.previousData?.login || '',
          password: '',
        }}
        validationSchema={RegisterValidationSchema}
        onSubmit={(values, { setSubmitting }) =>
          mutation.mutate(values, { onSettled: () => setSubmitting(false) })
        }
      >
        {({ handleSubmit, isValid, isSubmitting, isValidating, values }) => {
          return (
            <main className={styles['register__main']}>
              <Form autoComplete="off" className={styles['register__form']}>
                <Field
                  name="firstname"
                  type="text"
                  component={Input}
                  label="Prénom"
                  placeholder="Saisissez votre prénom"
                />

                <Field
                  name="lastname"
                  type="text"
                  component={Input}
                  label="Nom"
                  placeholder="Saisissez votre nom"
                />

                <Field
                  name="email"
                  type="email"
                  component={Input}
                  label="Adresse e-mail"
                  placeholder="Saisissez votre adresse e-mail"
                />

                <Field
                  name="password"
                  type="password"
                  component={Input}
                  label="Mot de passe"
                  placeholder="Saisissez votre mot de passe"
                />

                {mutation.isError && (
                  <Typography variant="body1" color="invalid">
                    {(mutation.error as any).message === 'Unauthorized'
                      ? 'Identifiants non valides.'
                      : 'Une erreur est survenue.'}
                  </Typography>
                )}

                <Button
                  type="submit"
                  loading={isSubmitting || isValidating}
                  className={styles['register__form__submit']}
                  onClick={() => handleSubmit()}
                  disabled={!isValid || isSubmitting || isValidating}
                >
                  C&apos;est parti !
                </Button>
              </Form>

              <Separator>ou</Separator>

              <div className={styles['register__form__social']}>
                <Button variant="reverse" icon="apple">
                  Continuer avec Apple
                </Button>

                <Button variant="reverse" icon="google">
                  Continuer avec Google
                </Button>
              </div>

              <Typography variant="body1" align="center">
                Vous avez déjà un compte ?&nbsp;
                <Button variant="link" to="/login" navigateOptions={{ state: { previousData: values } }}>
                  Connectez-vous
                </Button>
              </Typography>
            </main>
          );
        }}
      </Formik>
    </div>
  );
};

Register.displayName = 'Register';

export default Register;
