import { FC } from 'react';
import { object, string } from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';

import { LocationState } from 'routes';

import Input from 'components/Input';
import Typography from 'components/Typography';

import styles from './Login.module.scss';

const LoginValidationSchema = object().shape({
  login: string().required("Veuillez saisir un nom d'utilisateur"),
  password: string().required('Veuillez saisir un mot de passe'),
});

const Login: FC = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const locationState = useLocation().state as LocationState;

  const mutation = useMutation(login, {
    onSuccess: () => {
      const redirect = locationState?.from?.pathname || '/';

      // Navigate to the home page or the previous page
      navigate(redirect);
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
          login: '',
          password: '',
        }}
        validationSchema={LoginValidationSchema}
        onSubmit={(values, { setSubmitting }) =>
          mutation.mutate(values, { onSettled: () => setSubmitting(false) })
        }
      >
        {({ handleSubmit, isValid, isSubmitting, isValidating }) => {
          return (
            <Form className={styles['login__form']}>
              {mutation.isError && (
                <p className={styles.errorText}>An error occurred: {(mutation.error as any).message}</p>
              )}

              <Field
                name="login"
                type="text"
                component={Input}
                label="Nom d'utilisateur"
                autoComplete="username"
                placeholder="Saisissez votre nom d'utilisateur"
              />
              <ErrorMessage name="login" component="div" className="field-error" />

              <Field
                name="password"
                type="password"
                component={Input}
                label="Mot de passe"
                autoComplete="current-password"
                placeholder="Saisissez votre mot de passe"
              />
              <ErrorMessage name="password" component="div" className="field-error" />

              <button
                type="submit"
                onClick={() => handleSubmit}
                disabled={!isValid || isSubmitting || isValidating}
              >
                Submit
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

Login.displayName = 'Login';

export default Login;
