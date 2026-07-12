import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Info,
  Phone,
  ShoppingBag,
  Tags,
  LogOut,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderKanban },
  { href: "/admin/portfolio-categories", label: "Portfolio Categories", icon: Tags },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/about", label: "About Us", icon: Info },
  { href: "/admin/contact", label: "Contact", icon: Phone },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  async function handleLogout() {
    await apiRequest("POST", "/api/admin/logout");
    setLocation("/admin");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex">
      <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 p-4 flex flex-col">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="inline-block">
            <img
              src="/assets/logo.png"
              alt="wlsset design"
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 cursor-pointer rounded-r-lg ${
                    isActive
                      ? "text-[#A30A0A] font-semibold border-l-2 border-[#A30A0A] bg-[#A30A0A]/5"
                      : "text-[#f5f5f5] hover:text-white hover:bg-zinc-800/60 border-l-2 border-transparent"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-[#f5f5f5] hover:text-red-400 justify-start gap-3"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
