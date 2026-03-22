import * as React from "react"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  CommandIcon,
  LayoutDashboardIcon,
  ServerIcon,
} from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"

const data = {
  navMain: [
    { title: "Tổng quan", url: "/dashboard", icon: <LayoutDashboardIcon /> },
    { title: "Quản lý VM", url: "/vms", icon: <ServerIcon /> },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()

  const currentUser = {
    display_name: (user as any)?.display_name || "Quản trị viên",
    user_name: (user as any)?.user_name || "admin",
    avt_url: (user as any)?.avt_url || "" 
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/dashboard">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Mini Cloud</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}