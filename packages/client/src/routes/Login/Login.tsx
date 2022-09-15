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

import styles from './Login.module.scss';

const LoginValidationSchema = object().shape({
  login: string().required("Veuillez saisir un nom d'utilisateur."),
  password: string().required('Veuillez saisir un mot de passe.'),
});

const Login: FC = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const locationState = useLocation().state as LocationState;

  const mutation = useMutation(login, {
    onSuccess: () => {
      const exclude = ['landing', 'login', 'register'];

      if (locationState?.from?.pathname && !exclude.includes(locationState.from.pathname)) {
        // Navigate to the previous page
        navigate(locationState?.from?.pathname);
      }

      // Navigate to the home page
      navigate('/');
    },
  });

  return (
    <div className={styles['login']}>
      <header className={styles['login__header']}>
        <Typography variant="title1">Bienvenue ! 👋</Typography>
        <Typography variant="body1">Saisissez vos identifiants</Typography>
      </header>

      <Formik
        initialValues={{
          login: locationState?.previousData?.email || '',
          password: '',
        }}
        validationSchema={LoginValidationSchema}
        onSubmit={(values, { setSubmitting }) =>
          mutation.mutate(values, { onSettled: () => setSubmitting(false) })
        }
      >
        {({ handleSubmit, isValid, isSubmitting, isValidating, values }) => {
          return (
            <main className={styles['login__main']}>
              <Form autoComplete="off" className={styles['login__form']}>
                <Field
                  name="login"
                  type="email"
                  component={Input}
                  label="Nom d'utilisateur"
                  autoComplete="username"
                  placeholder="Saisissez votre nom d'utilisateur"
                />

                <Field
                  name="password"
                  type="password"
                  component={Input}
                  label="Mot de passe"
                  autoComplete="current-password"
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
                  className={styles['login__form__submit']}
                  onClick={() => handleSubmit()}
                  disabled={!isValid || isSubmitting || isValidating}
                >
                  Se connecter
                </Button>

                <Button variant="link" to="/forgotten" navigateOptions={{ state: { previousData: values } }}>
                  Mot de passe oublié ?
                </Button>
              </Form>

              <Separator>ou</Separator>

              <div className={styles['login__form__social']}>
                <Button variant="reverse" icon="apple">
                  Continuer avec Apple
                </Button>

                <Button variant="reverse" icon="google">
                  Continuer avec Google
                </Button>
              </div>

              <Typography variant="body1" align="center">
                Vous n&apos;avez pas de compte ?&nbsp;
                <Button variant="link" to="/register" navigateOptions={{ state: { previousData: values } }}>
                  Inscrivez-vous
                </Button>
              </Typography>
            </main>
          );
        }}
      </Formik>
    </div>
  );
};

Login.displayName = 'Login';

export default Login;
