import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HomePage() {
  return (
    <main className='flex-1'>
      <div className='max-w-xl px-4 mx-auto my-6 sm:my-12 md:my-16 lg:my-20'>
        <Tabs defaultValue='api-route' className='flex flex-col gap-y-2'>
          <ScrollArea className=''>
            <TabsList className='flex h-10 w-max mx-auto'>
              <TabsTrigger value='api-route'>With API Route</TabsTrigger>
              <TabsTrigger value='upload-thing'>With UploadThing</TabsTrigger>
              <TabsTrigger value='server-action'>
                With Server Actions
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
          <Card className='w-full max-w-[500px] mx-auto'>
            <TabsContent value='api-route'>
              <CardHeader>
                <CardTitle>API Route</CardTitle>
                <CardDescription>
                  Make changes to your API route here. Click save when you're
                  done.
                </CardDescription>
              </CardHeader>
            </TabsContent>
            <TabsContent value='upload-thing'>
              <CardHeader>
                <CardTitle>UploadThing</CardTitle>
                <CardDescription>
                  Make changes to your UploadThing here. Click save when you're
                  done.
                </CardDescription>
              </CardHeader>
            </TabsContent>
            <TabsContent value='server-action'>
              <CardHeader>
                <CardTitle>Server Action</CardTitle>
                <CardDescription>
                  Make changes to your Server Action here. Click save when
                  you're done.
                </CardDescription>
              </CardHeader>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </main>
  );
}
