"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import {
  LayoutDashboard,
  Car,
  Users,
  FileText,
  TestTube,
  Receipt,
  BarChart3,
  Share2,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
} from "lucide-react";

const navigationSections = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Inventory", href: "/inventory", icon: Car },
      { name: "Leads", href: "/leads", icon: Users },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Test Drives", href: "/test-drives", icon: TestTube },
      { name: "Customers", href: "/customers", icon: Users },
      { name: "Invoices", href: "/invoices", icon: Receipt },
      { name: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Social Posting", href: "/social", icon: Share2 },
      { name: "API Testing", href: "/api-testing", icon: FlaskConical },
      { name: "Users", href: "/users", icon: UserCog },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-card border-r border-border/50 transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo/Branding */}
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4 bg-primary/5">
        <div className="flex items-center gap-2">
          <Logo />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Adaptus</span>
              <span className="text-xs text-foreground/60">DMS</span>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full",
          "bg-primary text-white shadow-md",
          "hover:scale-110 transition-transform duration-200",
          "border border-primary/20"
        )}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-3 py-6 overflow-y-auto">
        {navigationSections.map((section, sectionIdx) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            {section.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 relative group",
                    isCollapsed ? "justify-center" : "",
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "text-foreground hover:bg-accent hover:text-foreground"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}

                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-200 relative z-10",
                      isActive ? "scale-110 text-white" : "group-hover:scale-105"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="relative z-10 truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div
        className={cn(
          "border-t border-border/50 p-4 bg-muted/20",
          isCollapsed && "px-2"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors duration-200 cursor-pointer",
            isCollapsed && "justify-center"
          )}
        >
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
            AD
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">Admin User</p>
              <p className="text-xs text-foreground/60 truncate">
                admin@adaptus.com
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
