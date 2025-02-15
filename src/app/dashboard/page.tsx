import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatChart } from "@/components/dashboard/chat-chart";

export default function Page() {
  return (
    <SidebarProvider>
      <div className="w-full h-[80vh] overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chart Component */}
          <ChatChart />

          {/* Placeholder for Other Dashboard Widgets */}
          <div className="bg-white shadow-md rounded-xl p-6 min-h-[200px]">Widget 1</div>
          <div className="bg-white shadow-md rounded-xl p-6 min-h-[200px]">Widget 2</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
