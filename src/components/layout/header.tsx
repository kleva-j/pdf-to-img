import { FileIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { ModeToggle } from '@/components/layout/mode-toggle';
import { Button } from '@/components/ui/button';

import { siteConfig } from '@/constant/config';

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b dark:border-slate-600/40 backdrop-blur dark:supports-[backdrop-filter]:bg-slate-950 supports-[backdrop-filter]:bg-white'>
      <div className='container flex h-14 items-center'>
        <Link href='/' className='mr-2 flex items-center md:mr-6 md:space-x-2'>
          <FileIcon className='size-4' aria-hidden='true' />
          <span className='hidden font-bold md:inline-block'>
            {siteConfig.name}
          </span>
        </Link>
        <nav className='flex flex-1 items-center md:justify-end'>
          <Button variant='ghost' size='icon' className='size-8' asChild>
            <Link
              aria-label='GitHub repo'
              href={siteConfig.links.github}
              target='_blank'
              rel='noopener noreferrer'
            >
              <GitHubLogoIcon className='size-4' aria-hidden='true' />
            </Link>
          </Button>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
