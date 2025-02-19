"use client";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import {Toaster} from "@/components/ui/toaster";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Mapping for breadcrumb names
  const breadcrumbMap: Record<string, string> = {
    dashboard: "Home",
    records: "Records",
    processdetails: "Process Details",
    announcementdetails: "Announcement Details",
  };

  // Generate breadcrumb trail
  const pathSegments = pathname.split("/").filter((segment) => segment);
  const breadcrumbItems = [];

  if (pathSegments.includes("records")) {
    breadcrumbItems.push(
      <BreadcrumbItem key="records">
        <BreadcrumbLink href="/dashboard/records">
          {breadcrumbMap["records"]}
        </BreadcrumbLink>
      </BreadcrumbItem>,
      <BreadcrumbSeparator key="separator1" />
    );
  }

  if (pathSegments.includes("processdetails") && pathSegments.length > 2) {
    const processId = pathSegments[pathSegments.length - 1];

    breadcrumbItems.push(
      <BreadcrumbItem key="record-details">
        <BreadcrumbPage>
          {breadcrumbMap["processdetails"]}
        </BreadcrumbPage>
      </BreadcrumbItem>
    );
  }

  if (pathSegments.includes("announcementdetails") && pathSegments.length > 2) {
    const processId = pathSegments[pathSegments.length - 1];

    breadcrumbItems.push(
      <BreadcrumbItem key="announcement-details">
        <BreadcrumbPage>
          {breadcrumbMap["announcementdetails"]}
        </BreadcrumbPage>
      </BreadcrumbItem>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header with Breadcrumbs */}
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {breadcrumbItems}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>

        {/* Page Content Below Breadcrumbs */}
        <main className="mt-4 px-7">{children}</main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
