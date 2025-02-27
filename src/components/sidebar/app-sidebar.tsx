"use client"

import * as React from "react"
import {
  SquarePen,
  LayoutDashboard,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/dashboard",
        },
        {
          title: "View Records",
          url: "/dashboard/records",
        },
        {
          title: "Generate URL",
          url: "/dashboard/url",
        },
      ],
    },
    {
      title: "Create",
      url: "#",
      icon: SquarePen,
      isActive: true,
      items: [
        {
          title: "FAQ",
          url: "/dashboard/faq",
        },
      ],
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
