import classNames from 'classnames';
import { FieldProps } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import { forwardRef, useMemo } from 'react';

import styles from './Input.module.scss';
import Typography from 'components/Typography';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps & FieldProps>(
  ({ field, type = 'text', label, className, form, ...props }, ref) => {
    const id = useMemo(() => {
      if (field?.name) {
        return `${field?.name}_${uuidv4()}`;
      }

      return undefined;
    }, [field?.name]);

    return (
      <div className={styles['input__container']}>
        {label && (
          <Typography variant="body1" element="label" className={styles['input__label']} htmlFor={id}>
            {label}
          </Typography>
        )}

        <input
          type={type}
          ref={ref}
          id={id}
          className={classNames(styles['input'], className)}
          {...field}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
