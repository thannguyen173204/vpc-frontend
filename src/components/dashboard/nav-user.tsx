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
import { EllipsisVerticalIcon, LogOutIcon, UserIcon } from "lucide-react"
import { useNavigate } from "react-router";
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

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avt_url} alt={user.display_name} className="object-cover" />
                <AvatarFallback className="rounded-lg bg-[#e4e6eb] dark:bg-muted">
                  <UserIcon className="size-5 text-[#bcc0c4] dark:text-muted-foreground" fill="currentColor" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.display_name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  #{user.user_name}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avt_url} alt={user.display_name} className="object-cover" />
                  <AvatarFallback className="rounded-lg bg-[#e4e6eb] dark:bg-muted">
                    <UserIcon className="size-5 text-[#bcc0c4] dark:text-muted-foreground" fill="currentColor" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.display_name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    #{user.user_name}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOutIcon />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}