'use client';

import { useState } from 'react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { ScrollArea, ScrollBar } from '@/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs';

export const tabList = [
  {
    name: 'API Route Handler',
    value: 'api-route',
    tabTitle: 'With API Route',
    description:
      "Make changes to your API route here. Click save when you're done.",
  },
  {
    name: 'With UploadThing',
    value: 'upload-thing',
    tabTitle: 'With UploadThing',
    description:
      "Make changes to your UploadThing here. Click save when you're done.",
  },
  {
    name: 'Using Server Action',
    value: 'server-action',
    tabTitle: 'With Server Actions',
    description:
      "Make changes to your Server Action here. Click save when you're done.",
  },
];

export const tabListMap = tabList.reduce(
  (acc, tab) => ({ ...acc, [tab.value]: tab }),
  {}
) as Record<string, (typeof tabList)[number]>;

export const PageContent = () => {
  const [activeTab, setActiveTab] = useState('api-route');
  const tabContent = tabListMap[activeTab];

  return (
    <Tabs
      defaultValue='api-route'
      className='flex flex-col gap-y-2'
      onValueChange={setActiveTab}
    >
      <ScrollArea>
        <TabsList className='flex h-10 w-max mx-auto gap-x-2'>
          {tabList.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='flex items-center gap-x-2 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 rounded-lg'
            >
              <span>{tab.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <Card className='w-full max-w-[500px] mx-auto'>
        <CardHeader>
          <CardTitle>{tabContent.tabTitle}</CardTitle>
          <CardDescription>{tabContent.description}</CardDescription>
        </CardHeader>
      </Card>
    </Tabs>
  );
};
