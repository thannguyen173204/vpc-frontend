import * as React from "react"

import { NavDocuments } from "@/components/dashboard/nav-documents"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
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

// 1. Import các Icon chuẩn xác cho hệ thống Cloud
import {
  CommandIcon,
  LayoutDashboardIcon,
  ServerIcon,
  NetworkIcon,
  HardDriveIcon,
  ShieldCheckIcon,
  ActivityIcon,
  Settings2Icon,
  Code2Icon,
  LifeBuoyIcon
} from "lucide-react"

// 2. Cập nhật dữ liệu cho Minicloud
const data = {
  user: {
    name: "Nguyễn Ngọc Thân", // Tên hiển thị của bạn
    email: "admin@ngocthan.click",
    avatar: "/avatars/admin.jpg", // Bạn có thể thay đường dẫn ảnh thật của mình vào đây
  },
  navMain: [
    {
      title: "Tổng quan",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Máy ảo (VMs)",
      url: "/vms",
      icon: <ServerIcon />,
    },
    {
      title: "Mạng & IP",
      url: "/networking",
      icon: <NetworkIcon />,
    },
    {
      title: "Lưu trữ",
      url: "/storage",
      icon: <HardDriveIcon />,
    },
    {
      title: "Bảo mật",
      url: "/security",
      icon: <ShieldCheckIcon />,
    },
  ],
  // Giữ key là 'documents' để không lỗi component cũ, nhưng data là của Cloud
  documents: [
    {
      name: "Giám sát tài nguyên",
      url: "/monitoring",
      icon: <ActivityIcon />,
    },
    {
      name: "API & Automation",
      url: "/api-docs",
      icon: <Code2Icon />,
    },
  ],
  navSecondary: [
    {
      title: "Cài đặt hệ thống",
      url: "/settings",
      icon: <Settings2Icon />,
    },
    // {
    //   title: "Hỗ trợ kỹ thuật",
    //   url: "/support",
    //   icon: <LifeBuoyIcon />,
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Mini Cloud</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Truyền dữ liệu mới vào các khe cắm (props) */}
        <NavMain items={data.navMain} />

        {/* NavDocuments giờ chứa thông tin Giám sát và API */}
        {/* <NavDocuments items={data.documents} /> */}

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}