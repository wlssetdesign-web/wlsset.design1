import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Save } from "lucide-react";

type ContactItem = {
  id: string;
  type: string;
  label: string;
  value: string;
  sortOrder: number;
};

const emptyForm = { type: "phone", label: "", value: "" };

export default function AdminContact() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: items = [] } = useQuery<ContactItem[]>({
    queryKey: ["/api/contact"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PUT", `/api/contact/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/contact/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/contact"] }),
  });

  function openEdit(item: ContactItem) {
    setEditId(item.id);
    setForm({ type: item.type, label: item.label, value: item.value });
    setOpen(true);
  }

  function openNew() {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
    setEditId(null);
    setForm(emptyForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      updateMutation.mutate({ id: editId, data: form });
    } else {
      createMutation.mutate(form);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Contact Management</h1>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" /> Add Contact
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id} className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="text-white font-semibold">{item.label}</h3>
                <p className="text-[#f5f5f5] text-sm">
                  <span className="text-[#f5f5f5] uppercase text-xs mr-2">{item.type}</span>
                  {item.value}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                  <Pencil className="h-4 w-4 text-[#f5f5f5]" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-[#f5f5f5] text-center py-12">No contact info yet.</p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Contact" : "Add Contact"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-[#f5f5f5]">
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="address">Address</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={form.label}
                onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                className="bg-zinc-800 border-zinc-700"
                placeholder="WhatsApp / Instagram / Email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                value={form.value}
                onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                className="bg-zinc-800 border-zinc-700"
                placeholder="+962..."
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" /> {editId ? "Save Changes" : "Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
