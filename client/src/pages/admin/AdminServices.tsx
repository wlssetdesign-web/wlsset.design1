import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Palette, Printer, Share2, Image, PenTool, BarChart, Video } from "lucide-react";

type Service = {
  id: string;
  key: string;
  titleEn: string;
  titleAr: string;
  itemsEn: string;
  itemsAr: string;
  icon: string;
  sortOrder: number;
  productOptions?: string | null;
};

const iconOptions: { value: string; label: string; icon: React.ComponentType<any> }[] = [
  { value: "Palette", label: "Palette", icon: Palette },
  { value: "Printer", label: "Printer", icon: Printer },
  { value: "Share2", label: "Share2", icon: Share2 },
  { value: "Image", label: "Image", icon: Image },
  { value: "PenTool", label: "PenTool", icon: PenTool },
  { value: "BarChart", label: "BarChart", icon: BarChart },
  { value: "Video", label: "Video", icon: Video },
];

function keyFromTitle(title: string): string {
  return title
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join("");
}

const emptyForm = {
  key: "",
  titleEn: "",
  titleAr: "",
  itemsEn: "",
  itemsAr: "",
  icon: "Palette",
  sortOrder: 0,
  productOptions: "",
};

export default function AdminServices() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const { data: services = [], isLoading, error } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/services", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      closeForm();
      toast({ title: "Service created", description: "New service has been added." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create service.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PUT", `/api/services/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      closeForm();
      toast({ title: "Service updated", description: "Service has been saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update service.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setDeleteTarget(null);
      toast({ title: "Service deleted", description: "Service has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete service.", variant: "destructive" });
    },
  });

  function openEdit(s: Service) {
    setEditId(s.id);
    setForm({
      key: s.key,
      titleEn: s.titleEn,
      titleAr: s.titleAr,
      itemsEn: s.itemsEn,
      itemsAr: s.itemsAr,
      icon: s.icon,
      sortOrder: s.sortOrder,
      productOptions: s.productOptions || "",
    });
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
    if (!form.titleEn.trim() || !form.titleAr.trim()) {
      toast({ title: "Validation error", description: "Both English and Arabic titles are required.", variant: "destructive" });
      return;
    }
    const payload = {
      ...form,
      key: editId ? form.key : keyFromTitle(form.titleEn),
      sortOrder: form.sortOrder || 0,
    };
    if (editId) {
      updateMutation.mutate({ id: editId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function getIconComponent(iconName: string) {
    const found = iconOptions.find((o) => o.value === iconName);
    return found ? found.icon : Palette;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Services Management</h1>
          <p className="text-[#f5f5f5] text-sm mt-1">
            {services.length} service{services.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={openNew} disabled={createMutation.isPending}>
          {createMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Add Service
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-[#f5f5f5]" />
        </div>
      )}

      {error && (
        <div className="text-center py-24">
          <p className="text-red-400">Failed to load services.</p>
        </div>
      )}

      {!isLoading && !error && services.length === 0 && (
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
            <Plus className="h-8 w-8 text-[#f5f5f5]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No services yet</h3>
          <p className="text-[#f5f5f5] mb-6 max-w-sm mx-auto">
            Add your first service to start receiving requests.
          </p>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4 mr-2" /> Add Your First Service
          </Button>
        </div>
      )}

      {!isLoading && !error && services.length > 0 && (
        <div className="grid gap-4">
          {services.sort((a, b) => a.sortOrder - b.sortOrder).map((s) => {
            const IconComp = getIconComponent(s.icon);
            return (
              <Card key={s.id} className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-lg bg-[#A30A0A]/10 flex items-center justify-center shrink-0">
                    <IconComp className="h-5 w-5 text-[#A30A0A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">{s.titleEn}</h3>
                    <p className="text-[#f5f5f5] text-sm truncate">{s.titleAr}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-[#f5f5f5]">
                        {s.icon}
                      </span>
                      <span className="text-xs text-zinc-500">Order: {s.sortOrder}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(s)} title="Edit">
                      <Pencil className="h-4 w-4 text-[#f5f5f5] hover:text-white transition-colors" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(s)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300 transition-colors" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) closeForm(); }}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Service" : "Add New Service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title (English) *</Label>
              <Input
                value={form.titleEn}
                onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))}
                className="bg-zinc-800 border-zinc-700"
                placeholder="e.g. Brand Identity Design"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Title (Arabic) *</Label>
              <Input
                value={form.titleAr}
                onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))}
                className="bg-zinc-800 border-zinc-700"
                placeholder="مثال: تصميم الهوية البصرية"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Items (English, comma separated)</Label>
              <Textarea
                value={form.itemsEn}
                onChange={(e) => setForm((p) => ({ ...p, itemsEn: e.target.value }))}
                className="bg-zinc-800 border-zinc-700"
                placeholder="Logo Design, Brand Guidelines, Color Palette"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Items (Arabic, comma separated)</Label>
              <Textarea
                value={form.itemsAr}
                onChange={(e) => setForm((p) => ({ ...p, itemsAr: e.target.value }))}
                className="bg-zinc-800 border-zinc-700"
                placeholder="تصميم الشعار، إرشادات العلامة التجارية، الألوان"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Product Options (comma separated)</Label>
              <Textarea
                value={form.productOptions}
                onChange={(e) => setForm((p) => ({ ...p, productOptions: e.target.value }))}
                className="bg-zinc-800 border-zinc-700"
                placeholder="Logo Design, Brand Guidelines, Color Palette"
                rows={3}
              />
              <p className="text-xs text-zinc-500">These appear in the &quot;Required Product&quot; dropdown on the request form.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select
                  value={form.icon}
                  onValueChange={(v) => setForm((p) => ({ ...p, icon: v }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-[#f5f5f5]">
                    {iconOptions.map((opt) => {
                      const IconComp = opt.icon;
                      return (
                        <SelectItem key={opt.value} value={opt.value}>
                          <span className="flex items-center gap-2">
                            <IconComp className="h-4 w-4" />
                            {opt.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editId ? "Save Changes" : "Add Service"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription className="text-[#f5f5f5]">
              Are you sure you want to delete <strong className="text-white">{deleteTarget?.titleEn}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
