import { LayoutDashboard, Megaphone, Calendar, HelpCircle, User, Building2, DollarSign } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const advertiserItems = [
  { title: "Dashboard", url: "/advertiser", icon: LayoutDashboard },
  { title: "Screens", url: "/advertiser/screens", icon: Megaphone },
  { title: "Campaigns", url: "/advertiser/campaigns", icon: Calendar },
  { title: "Support", url: "/advertiser/support", icon: HelpCircle },
  { title: "Profile", url: "/advertiser/profile", icon: User },
];

const mediaOwnerItems = [
  { title: "Dashboard", url: "/owner", icon: LayoutDashboard },
  { title: "My Screens", url: "/owner/screens", icon: Megaphone },
  { title: "Requests", url: "/owner/requests", icon: Building2 },
  { title: "Campaigns", url: "/owner/campaigns", icon: Calendar },
  { title: "Support", url: "/owner/support", icon: HelpCircle },
  { title: "Profile", url: "/owner/profile", icon: User },
];

export function AppSidebar({ role = "advertiser" }: { role?: "advertiser" | "owner" }) {
  const { state } = useSidebar();
  const location = useLocation();
  const items = role === "advertiser" ? advertiserItems : mediaOwnerItems;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {!isCollapsed && <span className="font-semibold text-lg">AdCentra</span>}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
