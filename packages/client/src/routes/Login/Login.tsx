import { FC } from 'react';
import { object, string } from 'yup';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Formik, Field, Form, ErrorMessage } from 'formik';

import useAuth from 'hooks/useAuth';

import styles from './Login.module.scss';

const LoginValidationSchema = object().shape({
  login: string().required("Veuillez saisir un nom d'utilisateur"),
  password: string().required('Veuillez saisir un mot de passe'),
});

const Login: FC = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const mutation = useMutation(login, {
    onSuccess: () => {
      // Navigate to the home page
      navigate('/');
    },
  });

  return (
    <div className={styles['login']}>
      <h1>Login</h1>

      <Formik
        initialValues={{
          login: '',
          password: '',
        }}
        validationSchema={LoginValidationSchema}
        onSubmit={(values) => mutation.mutate(values)}
        render={({ errors }) => {
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
                autoComplete="username"
                placeholder="Saisissez votre nom d'utilisateur"
              />
              <ErrorMessage name="login" component="div" className="field-error" />

              <label htmlFor="password">Password</label>
              <Field
                name="password"
                type="password"
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
      />
    </div>
  );
};

export default Login;
