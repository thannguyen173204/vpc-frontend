import { BellIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { timeAgo } from "@/lib/utils"
import { useNotificationStore } from "@/stores/useNotificationStore"

export function NotificationInbox() {
  // Lấy data chuẩn theo Best Practice của Zustand (Tách riêng từng dòng)
  const notifications = useNotificationStore((state) => state.notifications)
  const unreadCount = useNotificationStore((state) => state.unreadCount)
  const markAsRead = useNotificationStore((state) => state.markAsRead)
  const removeNotification = useNotificationStore((state) => state.removeNotification)

  return (
    <Popover onOpenChange={(open) => { if (open) markAsRead() }}>
      <PopoverTrigger asChild>
        <Button size="icon" className="size-8 relative" variant="outline">
          <BellIcon className="size-4" />
          
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[9px] text-white shadow-sm border border-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          
          <span className="sr-only">Thông báo</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="start" side="right">
        <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
          <h4 className="font-semibold text-sm">Thông báo hệ thống</h4>
        </div>
        
        <div className="max-h-[350px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center">
              <BellIcon className="h-8 w-8 mb-2 opacity-20" />
              Không có thông báo mới
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className="group flex items-start justify-between border-b px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col pr-4">
                  <p className="text-sm leading-snug">{notif.message}</p>
                  <span className="text-xs text-muted-foreground mt-1.5">{timeAgo(notif.time)}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 mt-0.5 shrink-0"
                  onClick={() => removeNotification(notif.id)}
                >
                  <XIcon className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}