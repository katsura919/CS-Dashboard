"use client";
import {ProcessTable} from "@/components/dashboard/process-table";

export default function Home() {

  return (
    <div>
         <h1 className="text-2xl font-bold mb-4">Announcements & Processes</h1>
        <ProcessTable/>
    </div>
  );
}
