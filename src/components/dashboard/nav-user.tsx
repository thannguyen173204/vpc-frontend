import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { EllipsisVerticalIcon, LogOutIcon, UserIcon, SettingsIcon, CreditCardIcon } from "lucide-react"
import { useNavigate } from "react-router"
import { useAuthStore } from "@/stores/useAuthStore"

export function NavUser({
  user,
}: {
  user: {
    display_name: string
    user_name: string
    avt_url?: string
  }
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { logOut } = useAuthStore()

  const handleLogout = () => {
    logOut()
    navigate('/login')
  }

  // Component Avatar dùng chung để đảm bảo đồng nhất UI
  const UserAvatar = () => (
    <Avatar className="h-8 w-8 rounded-lg border border-black/10 dark:border-white/10 bg-white p-0.5 shadow-sm">
      <AvatarImage 
        src={user.avt_url} 
        alt={user.display_name} 
        className="object-contain" // Giúp logo không bị cắt (fit)
      />
      <AvatarFallback className="rounded-lg bg-[#e4e6eb] dark:bg-muted">
        <UserIcon className="size-5 text-[#bcc0c4] dark:text-muted-foreground" fill="currentColor" />
      </AvatarFallback>
    </Avatar>
  )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar />
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-medium">{user.display_name}</span>
                <span className="truncate text-xs text-muted-foreground font-mono">
                  #{user.user_name}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-1.5 py-2 text-left text-sm">
                <UserAvatar />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.display_name}</span>
                  <span className="truncate text-xs text-muted-foreground font-mono">
                    #{user.user_name}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-medium"
            >
              <LogOutIcon className="mr-2 size-4" />
              Đăng xuất hệ thống
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}