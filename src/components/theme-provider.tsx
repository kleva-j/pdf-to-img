'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';

export const ThemeProvider = (props: ThemeProviderProps): JSX.Element => {
  return NextThemesProvider(props) as JSX.Element;
};
