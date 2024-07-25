import type { Metadata } from 'next';
import type { PropsWithChildren, ReactElement } from 'react';

import '@/styles/colors.css';

export const metadata: Metadata = {
  title: 'Components',
  description: 'Pre-built components with awesome default',
};

export default function Layout({ children }: PropsWithChildren): ReactElement {
  return <>{children}</>;
}
