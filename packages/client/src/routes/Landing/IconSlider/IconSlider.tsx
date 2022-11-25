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
    'atari',
    'atari-2600',
    'amstrad-cpc-464',
    'amstrad-cpc-6128',
    'blu-ray',
    'black-stories',
    'cd',
    'dvd',
    'pc-cd-rom',
    'exit-le-jeu',
    'nintendo-64',
    'nintendo-ds',
    'nintendo-3ds',
    'nintendo-nes',
    'nintendo-ds-icon',
    'nintendo-switch',
    'nintendo-wii-u',
    'philips',
    'philips-videopac',
    'playstation-1',
    'playstation-2',
    'playstation-3',
    'playstation-4',
    'playstation-5',
    'sega-dreamcast',
    'sega-game-gear',
    'sega-master-system',
    'sega-mega-drive',
    'super-nintendo',
    'super-nintendo-icon',
    'super-picsou-geant',
    'nintendo-game-and-watch',
    'nintendo-gameboy',
    'nintendo-gameboy-color',
    'nintendo-gameboy-advance',
    'nintendo-wii',
    'vhs',
    'vtech',
    'unlock',
    'xbox-360',
    'xbox-one',
    'xbox-classic',
    'xbox-series-x',
  ];

  const sliderRowItems = Array(14)
    .fill(null)
    .map(() => shuffle(icons));

  return (
    <div className={classNames(styles['icon-slider'], className)} style={{ ['--count']: icons.length }}>
      <div className={styles['icon-slider__content']}>
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
    </div>
  );
};

IconSlider.displayName = 'IconSlider';

export default IconSlider;
