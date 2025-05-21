import { Cpu, Home, Search, Settings, LayoutDashboard, LineChart, Info } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle"; // Theme Toggle Button

// Menu items.
const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", url: "/analytics", icon: LineChart },
  { title: "My Device", url: "/device", icon: Cpu },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 dark:text-gray-300">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-4 px-3 py-2 text-lg hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition"
                    >
                      <item.icon className="w-6 h-6" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* 📌 About Us (Redirects to GitHub) */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="https://github.com/cyberkutti-iedc/caria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-3 py-2 text-lg hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition"
                  >
                    <Info className="w-6 h-6 text-blue-500" />
                    <span>About Us</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 🌙 Dark Mode Toggle at the Bottom */}
        <div className="mt-auto p-4">
          <ModeToggle />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
