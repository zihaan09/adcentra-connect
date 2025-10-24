import { Bell, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function TopNav() {
  const notifications = [
    { id: 1, text: "Proposal received for Festive Launch", time: "2h ago", unread: true },
    { id: 2, text: "Hold approved for 4 screens", time: "5h ago", unread: true },
    { id: 3, text: "Campaign went live: Diwali 2024", time: "1d ago", unread: false },
  ];

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.filter(n => n.unread).length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-white text-xs">
                  {notifications.filter(n => n.unread).length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-semibold border-b">Notifications</div>
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-start justify-between">
                    <span className={notification.unread ? "font-medium" : ""}>{notification.text}</span>
                    {notification.unread && (
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <Moon className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
