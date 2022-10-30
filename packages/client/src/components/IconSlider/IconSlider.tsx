import { FC } from 'react';
import classNames from 'classnames';

import Icon from 'components/Icon/Icon';

import shuffle from 'utils/array/shuffle';

import styles from './IconSlider.module.scss';

export interface IconSliderProps {
  className?: string;
}

const IconSlider: FC<IconSliderProps> = (props) => {
  const { className } = props;

  const icons = [
    'apple',
    'atari',
    'nintendo-64',
    'nintendo-ds',
    'nintendo-switch',
    'nintendo-wii-u',
    'philips',
    'playstation',
    'sega-dreamcast',
    'sega-game-gear',
    'super-nintendo',
    'nintendo-gameboy',
    'xbox',
  ];

  const sliderRowItems = Array(14)
    .fill(null)
    .map(() => shuffle(icons));

  return (
    <div className={classNames(styles['icon-slider'], className)} style={{ ['--count']: icons.length }}>
      {sliderRowItems.map((items, index) => (
        <ul
          key={index}
          className={classNames(
            styles['icon-slider__carousel'],
            styles[`icon-slider__carousel--${index % 2 ? 'reverse' : 'normal'}`]
          )}
        >
          {items.map((item) => (
            <li key={`${index}_${item}`} className={styles['icon-slider__carousel__slide']}>
              <Icon name={item} className={styles['icon-slider__carousel__slide__icon']} />
            </li>
          ))}

          {items.map((item) => (
            <li
              key={`${index}_${item}_copy`}
              className={classNames(
                styles['icon-slider__carousel__slide'],
                styles['icon-slider__carousel__slide--copy']
              )}
            >
              <Icon name={item} className={styles['icon-slider__carousel__slide__icon']} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};

IconSlider.displayName = 'IconSlider';

export default IconSlider;
