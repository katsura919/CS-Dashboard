"use client";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Mapping for breadcrumb names
  const breadcrumbMap: Record<string, string> = {
    announceprocess: "Announcements & Processes",
  };

  // Extract the current page from the URL
  const currentPage = pathname.split("/").pop() || "";
  const breadcrumbText = breadcrumbMap[currentPage] || currentPage;

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
              {currentPage && currentPage !== "dashboard" && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize">{breadcrumbText}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>

        {/* Page Content Below Breadcrumbs */}
        <main className="mt-4 px-7">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
