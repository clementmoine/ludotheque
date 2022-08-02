import { useMemo } from 'react';
import classNames from 'classnames';

import type { FC } from 'react';

import styles from './Typography.module.scss';

type Level = 1 | 2 | 3 | 4 | 5 | 6;
type Type = 'title' | 'subtitle' | 'body' | 'caption';

export interface TypographyProps {
  className?: string;
  element?: keyof JSX.IntrinsicElements;
  variant?: `${Type}${Level}`;
}

const Typography: FC<TypographyProps> = (props) => {
  const { className, children, element, variant = 'body1' } = props;

  const Element: keyof JSX.IntrinsicElements = useMemo(() => {
    if (element) {
      return element;
    }

    if (variant.startsWith('title')) {
      return variant.replace('title', 'h') as keyof JSX.IntrinsicElements;
    }

    if (variant.startsWith('caption')) {
      return 'span';
    }

    return 'p';
  }, [element, variant]);

  return (
    <Element
      className={classNames([
        className,
        styles['typography'],
        {
          [styles[`typography--variant-${variant.match(/^(title|subtitle|body|caption)/)?.[0]}`]]: true,
          [styles[`typography--variant-${variant}`]]: true,
        },
      ])}
    >
      {children}
    </Element>
  );
};

Typography.displayName = 'Typography';

export default Typography;
