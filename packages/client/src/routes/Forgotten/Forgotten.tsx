import { FC, useState } from 'react';
import { object, string } from 'yup';
import { Formik, Field, Form } from 'formik';
import { useLocation } from 'react-router-dom';

import { LocationState } from 'routes';

import { forgottenPassword } from 'services/auth';

import Input from 'components/Input';
import Button from 'components/Button';
import Typography from 'components/Typography';

import styles from './Forgotten.module.scss';

const ForgottenValidationSchema = object().shape({
  email: string().required('Veuillez saisir une adresse e-mail.'),
});

const Forgotten: FC = () => {
  const [error, setError] = useState<Error>();
  const locationState = useLocation().state as LocationState;

  return (
    <div className={styles['forgotten']}>
      <header className={styles['forgotten__header']}>
        <Button icon="triangle-left" variant="link" color="text" to={locationState?.from?.pathname || '/'}>
          Retour
        </Button>

        <div className={styles['forgotten__title']}>
          <Typography variant="title1">Mot de passé oublié ? 🫵</Typography>
          <Typography variant="body1">
            Quelle honte vous ... hmm ... ça arrive à tout le monde d’oublier ! Saisissez votre adresse
            e-mail, nous vous enverrons un code de réinitialisation !
          </Typography>
        </div>
      </header>

      <Formik
        initialValues={{
          email: locationState?.previousData?.login || '',
        }}
        validationSchema={ForgottenValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);

          forgottenPassword(values.email)
            .catch(setError)
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ handleSubmit, isValid, isSubmitting, isValidating }) => {
          return (
            <main className={styles['forgotten__main']}>
              <Form autoComplete="off" className={styles['forgotten__form']}>
                <Field
                  name="email"
                  type="email"
                  component={Input}
                  label="Adresse e-mail"
                  placeholder="Saisissez votre adresse e-mail"
                />

                {!!error && (
                  <Typography variant="body1" color="invalid">
                    Une erreur est survenue.
                  </Typography>
                )}

                <Button
                  type="submit"
                  loading={isSubmitting || isValidating}
                  className={styles['forgotten__form__submit']}
                  onClick={() => handleSubmit()}
                  disabled={!isValid || isSubmitting || isValidating}
                >
                  Suivant
                </Button>
              </Form>
            </main>
          );
        }}
      </Formik>
    </div>
  );
};

Forgotten.displayName = 'Forgotten';

export default Forgotten;
