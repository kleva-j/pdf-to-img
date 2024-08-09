import { Content } from '@/layout/content';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';

export default function HomePage() {
  return (
    <main className='flex-1'>
      <div className='max-w-xl px-4 mx-auto my-6 sm:my-12 md:my-16 space-y-4'>
        <h2 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
          Files & Assets
        </h2>
        <Card className='rounded-lg shadow-sm'>
          <CardHeader>
            <CardTitle>Convert PDF File</CardTitle>
            <CardDescription>
              Convert a PDF file to an image and save it to Edgestore.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Content />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
