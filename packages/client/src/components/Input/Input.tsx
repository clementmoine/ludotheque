import { forwardRef } from 'react';
import { FieldProps } from 'formik';
import classNames from 'classnames';

import styles from './Input.module.scss';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps & FieldProps>(
  ({ field, type = 'text', className, ...props }, ref) => {
    return (
      <input type={type} ref={ref} className={classNames(styles['input'], className)} {...field} {...props} />
    );
  }
);

Input.displayName = 'Input';

export default Input;
