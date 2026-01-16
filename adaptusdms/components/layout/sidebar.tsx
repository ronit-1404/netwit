"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, signOut } from "@/lib/actions/auth";
import { toast } from "react-hot-toast";

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
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; fullName: string; avatar?: string } | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Header/Navbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border/50 flex items-center px-4 shadow-sm">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-md"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="ml-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Car className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">Adaptus</span>
            <span className="text-xs text-muted-foreground">DMS</span>
          </div>
        </div>
      </header>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-16"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex h-full flex-col bg-card border-r border-border/50 relative",
          "fixed lg:relative left-0 z-40",
          "top-16 lg:top-0 bottom-0 lg:inset-y-0",
          "transition-transform duration-300 ease-in-out lg:translate-x-0",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
      {/* Logo/Branding */}
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4 bg-primary/5">
        <div className="flex items-center gap-2">
          <Logo showText={false} />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Adaptus</span>
              <span className="text-xs text-foreground/60">DMS</span>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button - Desktop Only */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "hidden lg:flex absolute -right-3 top-20 z-50 h-6 w-6 items-center justify-center rounded-full",
          "bg-primary text-white shadow-md",
          "hover:scale-110",
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
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium relative group",
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
                      "h-5 w-5 relative z-10",
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
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2 hover:bg-accent cursor-pointer w-full",
                  isCollapsed && "justify-center"
                )}
              >
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {getInitials(user.fullName)}
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate text-foreground">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-foreground/60 truncate">
                        {user.email}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2 hover:bg-accent cursor-pointer w-full",
                  isCollapsed && "justify-center"
                )}
              >
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm flex-shrink-0">
                  ?
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate text-foreground">Guest User</p>
                      <p className="text-xs text-foreground/60 truncate">
                        Not signed in
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push('/login')}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/signup')}>
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
    </>
  );
}
