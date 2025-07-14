"use client"
import { Home, Building2, PieChart, Search, Filter } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    disabled: false,
  },
  {
    title: "Asset Search",
    url: "/asset-search",
    icon: Search,
    disabled: false,
  },
  {
    title: "Asset View",
    url: "/asset-view",
    icon: Building2,
    disabled: true, // Enabled when assets selected
  },
  {
    title: "Filter Page",
    url: "/filter",
    icon: Filter,
    disabled: false,
  },
  {
    title: "Portfolio View",
    url: "/portfolio-view",
    icon: PieChart,
    disabled: true, // Enabled when CSV uploaded or filters applied
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-[#E6ECF0]">
      <SidebarHeader className="border-b border-[#E6ECF0] bg-[#003DA5] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FDB913] rounded flex items-center justify-center">
              <span className="text-[#003DA5] font-bold text-sm">ARC</span>
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="text-lg font-semibold">Amplify Risk Console</h2>
              <p className="text-xs text-blue-200">RBC Commercial Banking</p>
            </div>
          </div>
          <SidebarTrigger className="text-white hover:bg-blue-700" />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!item.disabled}
                    isActive={pathname === item.url}
                    disabled={item.disabled}
                    className={cn(
                      "text-gray-700 hover:bg-[#E6ECF0] hover:text-[#003DA5]",
                      pathname === item.url && "bg-[#E6ECF0] text-[#003DA5] font-medium",
                      item.disabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {item.disabled ? (
                      <div className="flex items-center gap-2 w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <Link href={item.url} className="flex items-center gap-2 w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
