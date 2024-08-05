'use client';

import { useState } from 'react';

import { ApiRouteForm } from '@/components/api-route/form';
import { EdgeStoreForm } from '@/components/edgestore/form';
import { Component } from '@/components/server-action/component';

import { Card, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { ScrollArea, ScrollBar } from '@/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs';

export const tabList = [
  {
    name: 'API Route Handler',
    value: 'api-route',
    tabTitle: 'With API Route',
    description:
      "Make changes to your API route handler here. Click save when you're done.",
    component: ApiRouteForm,
  },
  {
    name: 'With Edgestore',
    value: 'edgestore',
    tabTitle: 'With Edgestore',
    description:
      "Make changes to your Edgestore here. Click save when you're done.",
    component: EdgeStoreForm,
  },
  {
    name: 'Using Server Action',
    value: 'server-action',
    tabTitle: 'Using Server Actions',
    description:
      "Make changes to your Server Action here. Click save when you're done.",
    component: Component,
  },
];

export const tabListMap = tabList.reduce(
  (acc, tab) => ({ ...acc, [tab.value]: tab }),
  {}
) as Record<string, (typeof tabList)[number]>;

export const PageContent = () => {
  const [activeTab, setActiveTab] = useState('api-route');
  const tabContent = tabListMap[activeTab];
  const CardContent = tabContent.component;

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
        <div className='px-6 pb-6'>
          <CardContent />
        </div>
      </Card>
    </Tabs>
  );
};
