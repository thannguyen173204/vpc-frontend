"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CirclePlusIcon } from "lucide-react"
import { Link } from "react-router" // Hoặc next/link tùy framework bạn dùng
import { NotificationInbox } from "./notification-inbox"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {

  // Tạm thời dùng URL param để gọi trang Tạo VM
  // Khi user click, nó sẽ chuyển sang /vms?create=true
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild
              tooltip="Khởi tạo nhanh"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <Link to="/vms?create=true">
                <CirclePlusIcon />
                <span>Tạo VM</span>
              </Link>
            </SidebarMenuButton>
            
            {/* COMPONENT INBOX XUẤT HIỆN Ở ĐÂY */}
            <NotificationInbox />
            
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link to={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}