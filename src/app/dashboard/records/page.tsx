"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FAQTable } from "@/components/dashboard/tables/faq-table";
import {ChatTable} from '@/components/dashboard/tables/chat-table';

export default function Home() {
  return (
    <div>
      <Tabs defaultValue="processes" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="processes">Processes</TabsTrigger>
          <TabsTrigger value="chat">Chats</TabsTrigger>
        </TabsList>

        <TabsContent value="processes">
          <FAQTable />
        </TabsContent>


        <TabsContent value="chat">
          <ChatTable />
        </TabsContent>

      </Tabs>
    </div>
  );
}
