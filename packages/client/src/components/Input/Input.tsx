import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { forwardRef, useMemo } from 'react';
import { FieldProps, ErrorMessage } from 'formik';

import Typography from 'components/Typography';

import styles from './Input.module.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps & Partial<FieldProps>>(
  ({ type = 'text', label, className, name, field = {}, form, ...props }, ref) => {
    const id = useMemo(() => {
      if (field.name || name) {
        return `${field.name || name}_${uuidv4()}`;
      }

      return undefined;
    }, [name, field.name]);

    return (
      <div className={styles['input__container']}>
        {label && (
          <Typography variant="body1" element="label" className={styles['input__label']} htmlFor={id}>
            {label}
          </Typography>
        )}

        <input
          id={id}
          ref={ref}
          type={type}
          className={classNames(styles['input'], className)}
          {...props}
          {...field}
        />

        {field.name && (
          <ErrorMessage name={field.name}>
            {(error) => (
              <Typography variant="body1" color="invalid">
                {error}
              </Typography>
            )}
          </ErrorMessage>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
