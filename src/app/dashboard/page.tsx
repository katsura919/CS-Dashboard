import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatChart } from "@/components/dashboard/chat-chart";
import { ChatPie } from "@/components/dashboard/pie-chart";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

export default function Page() {
 
  return (
    <SidebarProvider>
      <div className="w-full h-screen p-6">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total Revenue"
            value="$45,231.89"
            change="+20.1% from last month"
            icon={DollarSign}
            description=""
          />
          <StatsCard
            title="Subscriptions"
            value="+2,350"
            change="+180.1% from last month"
            icon={Users}
            description=""
          />
          <StatsCard
            title="Sales"
            value="+12,234"
            change="+19% from last month"
            icon={CreditCard}
            description=""
          />
          <StatsCard
            title="Active Now"
            value="+573"
            change="+201 since last hour"
            icon={Activity}
            description=""
          />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Chart Section */}
          <div>
            <ChatChart />
          </div>

          {/* Pie Chart Section */}
          <div>
            <ChatPie />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
