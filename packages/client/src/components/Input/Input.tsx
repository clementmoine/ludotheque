import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { FieldProps, ErrorMessage } from 'formik';
import { forwardRef, useCallback, useMemo, useState, InputHTMLAttributes } from 'react';

import Spinner from 'components/Spinner';
import Typography from 'components/Typography';

import Button, { ButtonProps } from 'components/Button';

import styles from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  loading?: boolean;
  right?: {
    to?: ButtonProps['to'];
    icon: ButtonProps['icon'];
    onClick?: ButtonProps['onClick'];
  };
  left?: {
    to?: ButtonProps['to'];
    icon: ButtonProps['icon'];
    onClick?: ButtonProps['onClick'];
  };
}

const Input = forwardRef<HTMLInputElement, InputProps & Partial<FieldProps>>((props, ref) => {
  const { type = 'text', label, className, name, field, form, loading, left, right, ...restProps } = props;

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleClear = useCallback(() => {
    if (form && field) {
      form.setFieldValue(field.name, '');
      field.onChange('');

      return;
    }
  }, [form, field]);

  const handleTogglePassword = useCallback(() => {
    setPasswordVisible((currentVisible) => !currentVisible);
  }, []);

  const id = useMemo(() => {
    if (field?.name || name) {
      return `${field?.name || name}_${uuidv4()}`;
    }

    return undefined;
  }, [name, field?.name]);

  return (
    <div className={styles['input__field']}>
      {label && (
        <Typography variant="body1" element="label" className={styles['input__label']} htmlFor={id}>
          {label}
        </Typography>
      )}

      <div
        style={{
          '--left-icon-count': [!!left].filter(Boolean).length,
          '--right-icon-count': [!!right, type === 'password', !!field?.value, loading].filter(Boolean)
            .length,
        }}
        className={classNames(styles['input__container'])}
      >
        <div className={styles['input__container__left']}>
          {/* Left button */}
          {left && <Button variant="icon" {...left} className={styles['input__container__left__item']} />}
        </div>

        {/* Input */}
        <input
          id={id}
          ref={ref}
          className={classNames(styles['input'], className)}
          type={type === 'password' && passwordVisible ? 'text' : type}
          {...field}
          {...restProps}
        />

        <div className={styles['input__container__right']}>
          {/* Loader */}
          {loading && <Spinner size="xs" className={styles['input__container__right__item']} />}

          {type === 'password' && (
            <Button
              variant="icon"
              onClick={handleTogglePassword}
              icon={passwordVisible ? 'eye-stroked' : 'eye'}
              className={styles['input__container__right__item']}
            />
          )}

          {/* Right button */}
          {right && <Button variant="icon" className={styles['input__container__right__item']} {...right} />}

          {/* Clear icon */}
          {field?.value && (
            <Button
              variant="icon"
              onClick={handleClear}
              icon="close"
              className={styles['input__container__right__item']}
            />
          )}
        </div>
      </div>

      {field?.name && (
        <ErrorMessage name={field?.name}>
          {(error) => (
            <Typography variant="body1" color="invalid">
              {error}
            </Typography>
          )}
        </ErrorMessage>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
