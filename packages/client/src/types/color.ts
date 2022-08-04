import colors from 'theme/colors.module.scss';

export type Color = string;

export function getTheme(color?: Color) {
  console.log(colors);
  if (color && color in colors) {
    return colors[color];
  }

  return color;
}

export default Color;
