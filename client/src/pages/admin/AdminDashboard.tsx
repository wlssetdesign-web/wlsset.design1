import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Wrench, Info, Phone, ShoppingBag } from "lucide-react";

export default function AdminDashboard() {
  const { data: portfolio } = useQuery({
    queryKey: ["/api/portfolio"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  const { data: services } = useQuery({
    queryKey: ["/api/services"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  const { data: about } = useQuery({
    queryKey: ["/api/about"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  const { data: contact } = useQuery({
    queryKey: ["/api/contact"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  const { data: orders } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const cards = [
    { title: "Portfolio Items", count: Array.isArray(portfolio) ? portfolio.length : 0, icon: FolderKanban },
    { title: "Services", count: Array.isArray(services) ? services.length : 0, icon: Wrench },
    { title: "About Sections", count: Array.isArray(about) ? about.length : 0, icon: Info },
    { title: "Contact Info", count: Array.isArray(contact) ? contact.length : 0, icon: Phone },
    { title: "Orders", count: Array.isArray(orders) ? orders.length : 0, icon: ShoppingBag },
  ];

  const gridCols = cards.length <= 4
    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className={`grid ${gridCols} gap-4`}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="group bg-zinc-900/60 border-zinc-800 transition-all duration-200 hover:border-[#A30A0A]/40 hover:shadow-[0_0_20px_rgba(163,10,10,0.15)]"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#f5f5f5]">{card.title}</CardTitle>
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#A30A0A]/10 group-hover:bg-[#A30A0A]/20 transition-colors duration-200">
                  <Icon className="h-5 w-5 text-[#A30A0A]" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{card.count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
