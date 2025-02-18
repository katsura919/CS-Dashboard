"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProcessTable } from "@/components/dashboard/tables/process-table";
import { AnnouncementTable } from "@/components/dashboard/tables/announcement-table";
import {ChatTable} from '@/components/dashboard/tables/chat-table';

export default function Home() {
  return (
    <div>
      <Tabs defaultValue="processes" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="processes">Processes</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="chat">Chats</TabsTrigger>
        </TabsList>

        <TabsContent value="processes">
          <ProcessTable />
        </TabsContent>

        <TabsContent value="announcements">
          <AnnouncementTable />
        </TabsContent>

        <TabsContent value="chat">
          <ChatTable />
        </TabsContent>

      </Tabs>
    </div>
  );
}
