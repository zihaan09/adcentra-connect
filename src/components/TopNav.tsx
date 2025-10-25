import { Bell, Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useNotificationStore } from "@/store";
import { formatDateTime } from "@/lib/utils";

export function TopNav() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { notifications, getNotificationsByUser, markAsRead, getUnreadCount } = useNotificationStore();

  const userNotifications = user ? getNotificationsByUser(user.id) : [];
  const unreadCount = getUnreadCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    // Navigate to relevant page based on notification type
    // This would be implemented based on the notification data
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-semibold border-b">Notifications</div>
            {userNotifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              userNotifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className="p-3 cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-start justify-between">
                      <span className={!notification.read ? "font-medium" : ""}>
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(notification.createdAt)}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            {userNotifications.length > 5 && (
              <div className="p-2 text-center text-sm text-muted-foreground border-t">
                {userNotifications.length - 5} more notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon">
          <Moon className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-white">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user?.name}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role === 'advertiser' ? 'Advertiser' : 'Media Owner'}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/${user?.role}/profile`)}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
