import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, MessageCircle, Instagram, Calendar, User, Phone, Mail } from "lucide-react";

type OrderItem = {
  title: string;
  requiredProduct: string;
  designNotes: string;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  channel: string;
  items: OrderItem[];
  createdAt: string;
};

export default function AdminOrders() {
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="bg-zinc-900/60 border-zinc-800 transition-all duration-200 hover:border-[#A30A0A]/40"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-[#f5f5f5] text-lg flex items-center gap-2">
                      <User className="h-4 w-4 text-[#A30A0A]" />
                      {order.customerName}
                    </CardTitle>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-zinc-400">
                      {order.customerPhone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          {order.customerPhone}
                        </span>
                      )}
                      {order.customerEmail && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          {order.customerEmail}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {order.channel === "whatsapp" ? (
                          <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Instagram className="h-3.5 w-3.5 text-pink-500" />
                        )}
                        {order.channel === "whatsapp" ? "WhatsApp" : "Instagram"}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-zinc-800">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm font-semibold text-[#f5f5f5]">{item.title}</p>
                      <div className="mt-1 text-xs text-zinc-400 space-y-0.5">
                        <p>Product: {item.requiredProduct}</p>
                        {item.designNotes && (
                          <p className="line-clamp-2">Notes: {item.designNotes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
