import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { siteConfig } from '@/constant/config';

export function Footer() {
  return (
    <footer className='absolute bottom-2 text-gray-700 text-sm w-full text-center flex items-center justify-center'>
      © {new Date().getFullYear()} By{' '}
      <Button variant='link' asChild>
        <Link
          href={siteConfig.links.github}
          target='_blank'
          rel='noopener noreferrer'
        >
          Michael Obasi
        </Link>
      </Button>
    </footer>
  );
}
