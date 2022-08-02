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
      <Typography variant="title1">Login</Typography>

      <Formik
        initialValues={{
          login: '',
          password: '',
        }}
        validationSchema={LoginValidationSchema}
        onSubmit={(values) => mutation.mutate(values)}
      >
        {({ errors }) => {
          const isInvalid = !!Object.keys(errors).length;

          return (
            <Form>
              {mutation.isError && (
                <p className={styles.errorText}>An error occurred: {(mutation.error as any).message}</p>
              )}

              <label htmlFor="login">Login</label>
              <Field
                name="login"
                type="text"
                component={Input}
                autoComplete="username"
                placeholder="Saisissez votre nom d'utilisateur"
              />
              <ErrorMessage name="login" component="div" className="field-error" />

              <label htmlFor="password">Password</label>
              <Field
                name="password"
                type="password"
                component={Input}
                autoComplete="current-password"
                placeholder="Saisissez votre mot de passe"
              />
              <ErrorMessage name="password" component="div" className="field-error" />

              <button type="submit" disabled={isInvalid}>
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
