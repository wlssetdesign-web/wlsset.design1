import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Save, Upload } from "lucide-react";

type AboutSection = {
  id: string;
  sectionKey: string;
  titleEn: string;
  titleAr: string;
  textEn: string;
  textAr: string;
  image: string | null;
  sortOrder: number;
};

export default function AdminAbout() {
  const queryClient = useQueryClient();
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titleEn: "", titleAr: "", textEn: "", textAr: "", image: "" });

  const { data: sections = [] } = useQuery<AboutSection[]>({
    queryKey: ["/api/about"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PUT", `/api/about/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      setOpen(false);
    },
  });

  function openEdit(s: AboutSection) {
    setEditId(s.id);
    setForm({
      titleEn: s.titleEn,
      titleAr: s.titleAr,
      textEn: s.textEn,
      textAr: s.textAr,
      image: s.image || "",
    });
    setOpen(true);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
    const data = await res.json();
    setForm((p) => ({ ...p, image: data.url }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      const payload: any = { ...form };
      if (!payload.image) delete payload.image;
      updateMutation.mutate({ id: editId, data: payload });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">About Us Management</h1>
      <div className="grid gap-4">
        {sections.map((s) => (
          <Card key={s.id} className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold">{s.sectionKey}</h3>
                <p className="text-[#f5f5f5] text-sm truncate">{s.titleEn}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                <Pencil className="h-4 w-4 text-[#f5f5f5]" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit About Section</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title (English)</Label>
              <Input
                value={form.titleEn}
                onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Title (Arabic)</Label>
              <Input
                value={form.titleAr}
                onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Text (English)</Label>
              <Textarea
                value={form.textEn}
                onChange={(e) => setForm((p) => ({ ...p, textEn: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Text (Arabic)</Label>
              <Textarea
                value={form.textAr}
                onChange={(e) => setForm((p) => ({ ...p, textAr: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex gap-2">
                <Input
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 flex-1"
                  placeholder="/images/filename.png"
                />
                <Label className="cursor-pointer">
                  <div className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md px-3 py-2">
                    <Upload className="h-4 w-4" />
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </Label>
              </div>
              {form.image && (
                <img src={form.image} alt="preview" className="w-32 h-20 object-cover rounded mt-2" />
              )}
            </div>
            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
