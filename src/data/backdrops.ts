import { BackdropFinish, ThemeMode } from '../types';
import darkWalnutImg from '../assets/images/bg_dark_walnut_wood_1795081052867.jpg';
import charredOakImg from '../assets/images/bg_charred_ebony_wood_1795081067902.jpg';
import whiteOakImg from '../assets/images/bg_light_white_oak_1795081052895.jpg';
import honeyAshImg from '../assets/images/bg_light_honey_ash_1795081053195.jpg';

export interface BackdropOption {
  id: BackdropFinish;
  label: string;
  group: 'dark-wood' | 'light-wood';
  theme: ThemeMode;
  baseBg: string;
  imageSrc?: string;
  imageScaleClass?: string;
  imageOpacityClass: string;
  scrimStyle: string;
  swatchStyle: string;
}

export const BACKDROP_OPTIONS: BackdropOption[] = [
  {
    id: 'dark-walnut',
    label: 'Smoked Walnut',
    group: 'dark-wood',
    theme: 'rustic-dark',
    baseBg: '#120c08',
    imageSrc: darkWalnutImg,
    imageOpacityClass: 'opacity-80',
    scrimStyle:
      'radial-gradient(ellipse 72% 65% at 64% 34%, rgba(28,18,11,0.34) 0%, rgba(16,10,6,0.68) 68%, rgba(11,7,4,0.88) 100%)',
    swatchStyle:
      'linear-gradient(135deg, #3c2718 0%, #24160d 55%, #160d08 100%)'
  },
  {
    id: 'dark-charred',
    label: 'Charred Oak',
    group: 'dark-wood',
    theme: 'rustic-dark',
    baseBg: '#100c09',
    imageSrc: charredOakImg,
    imageOpacityClass: 'opacity-75',
    scrimStyle:
      'radial-gradient(ellipse 72% 65% at 64% 34%, rgba(22,16,12,0.42) 0%, rgba(12,9,7,0.74) 68%, rgba(8,6,4,0.92) 100%)',
    swatchStyle:
      'linear-gradient(135deg, #2d2219 0%, #19130f 55%, #0e0b09 100%)'
  },
  {
    id: 'dark-matte',
    label: 'Espresso Matte',
    group: 'dark-wood',
    theme: 'rustic-dark',
    baseBg: '#120c08',
    imageOpacityClass: 'opacity-0',
    scrimStyle:
      'radial-gradient(ellipse 70% 60% at 64% 32%, rgba(36,24,15,0.22) 0%, rgba(18,12,8,0.92) 72%)',
    swatchStyle: 'linear-gradient(135deg, #1b120c 0%, #120c08 100%)'
  },
  {
    id: 'light-oak',
    label: 'White Oak',
    group: 'light-wood',
    theme: 'warm-beige',
    baseBg: '#ece7de',
    imageSrc: whiteOakImg,
    imageOpacityClass: 'opacity-72',
    scrimStyle:
      'radial-gradient(ellipse 72% 65% at 64% 34%, rgba(244,239,231,0.44) 0%, rgba(236,231,222,0.70) 70%, rgba(227,221,210,0.86) 100%)',
    swatchStyle:
      'linear-gradient(135deg, #dfd0ba 0%, #cbb89d 55%, #b8a285 100%)'
  },
  {
    id: 'light-honey',
    label: 'Honey Ash',
    group: 'light-wood',
    theme: 'warm-beige',
    baseBg: '#eae2d4',
    imageSrc: honeyAshImg,
    imageScaleClass: 'scale-[1.22]',
    imageOpacityClass: 'opacity-68',
    scrimStyle:
      'radial-gradient(ellipse 72% 65% at 64% 34%, rgba(246,238,225,0.42) 0%, rgba(236,227,211,0.68) 70%, rgba(225,214,195,0.85) 100%)',
    swatchStyle:
      'linear-gradient(135deg, #e2c89f 0%, #cfb082 55%, #ba9867 100%)'
  },
  {
    id: 'light-linen',
    label: 'Warm Paper',
    group: 'light-wood',
    theme: 'warm-beige',
    baseBg: '#ece9e3',
    imageOpacityClass: 'opacity-0',
    scrimStyle:
      'radial-gradient(ellipse 70% 60% at 64% 32%, rgba(248,245,239,0.35) 0%, rgba(236,233,227,0.92) 72%)',
    swatchStyle: 'linear-gradient(135deg, #f3efe8 0%, #e5e0d7 100%)'
  }
];
