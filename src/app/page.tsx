import '@/lib/env';

import UnderlineLink from '@/components/links/UnderlineLink';

// import Logo from '~/svg/Logo.svg';

export default function HomePage() {
  return (
    <main>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <footer className='absolute bottom-2 text-gray-700 text-sm'>
            © {new Date().getFullYear()} By{' '}
            <UnderlineLink href='https://michaelobasi.dev?ref=tsnextstarter'>
              Michael Obasi
            </UnderlineLink>
          </footer>
        </div>
      </section>
    </main>
  );
}
