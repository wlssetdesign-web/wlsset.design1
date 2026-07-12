import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card, CardContent,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Loader2, X, Video, Film, Layout } from "lucide-react";
import { Link } from "wouter";

type MediaItem = {
  url: string;
  type: "image" | "video";
  sortOrder: number;
};

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tags?: string;
  projectLink?: string;
  isFullPage?: boolean;
  showImageOnHover?: boolean;
  sortOrder?: number;
  media?: MediaItem[];
};

const categories = ["Branding", "Print", "Social Media", "Image Editing", "Vector Tracing", "Infographic Design", "Video"];

const emptyForm = {
  title: "",
  category: "Branding",
  image: "",
  description: "",
  tags: "",
  projectLink: "",
  isFullPage: false,
  showImageOnHover: true,
  sortOrder: 0,
  media: [] as MediaItem[],
};

export default function AdminPortfolio() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);

  const { data: items = [], isLoading, error } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/portfolio", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      closeForm();
      toast({ title: "Project created", description: "Portfolio item has been added." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create project.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PUT", `/api/portfolio/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      closeForm();
      toast({ title: "Project updated", description: "Portfolio item has been saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update project.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/portfolio/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setDeleteTarget(null);
      toast({ title: "Project deleted", description: "Portfolio item has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete project.", variant: "destructive" });
    },
  });

  function openEdit(item: PortfolioItem) {
    setEditId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      image: item.image,
      description: item.description,
      tags: item.tags || "",
      projectLink: item.projectLink || "",
      isFullPage: item.isFullPage || false,
      showImageOnHover: item.showImageOnHover ?? true,
      sortOrder: item.sortOrder || 0,
      media: item.media || [],
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

  async function handleFilesUpload(files: FileList) {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) {
        fd.append("files", files[i]);
      }
      const res = await fetch("/api/upload-multiple", { method: "POST", body: fd, credentials: "include" });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const newMedia: MediaItem[] = data.items.map((item: any, idx: number) => ({
        url: item.url,
        type: item.type as "image" | "video",
        sortOrder: form.media.length + idx,
      }));
      setForm((prev) => {
        const updated = [...prev.media, ...newMedia];
        return {
          ...prev,
          media: updated,
          image: updated.length > 0 ? updated[0].url : prev.image,
        };
      });
      toast({ title: `${files.length} file(s) uploaded` });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeMedia(index: number) {
    setForm((prev) => {
      const updated = prev.media.filter((_, i) => i !== index).map((m, i) => ({ ...m, sortOrder: i }));
      return {
        ...prev,
        media: updated,
        image: updated.length > 0 ? updated[0].url : "",
      };
    });
  }

  function moveMedia(fromIndex: number, direction: -1 | 1) {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= form.media.length) return;
    setForm((prev) => {
      const updated = [...prev.media];
      [updated[fromIndex], updated[toIndex]] = [updated[toIndex], updated[fromIndex]];
      const reindexed = updated.map((m, i) => ({ ...m, sortOrder: i }));
      return {
        ...prev,
        media: reindexed,
        image: reindexed.length > 0 ? reindexed[0].url : "",
      };
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files;
    if (file) handleFilesUpload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFilesUpload(files);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast({ title: "Validation error", description: "Title and description are required.", variant: "destructive" });
      return;
    }
    if (form.media.length === 0 && !form.image.trim()) {
      toast({ title: "Validation error", description: "At least one media file is required.", variant: "destructive" });
      return;
    }
    const payload: any = {
      title: form.title,
      category: form.category,
      image: form.image,
      description: form.description,
      tags: form.tags || undefined,
      projectLink: form.projectLink || undefined,
      isFullPage: form.isFullPage,
      showImageOnHover: form.showImageOnHover,
      sortOrder: form.sortOrder,
      media: form.media,
    };
    if (editId) {
      updateMutation.mutate({ id: editId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function isVideoFile(url: string) {
    return /\.(mp4|webm|mov|avi|mkv)$/i.test(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Management</h1>
          <p className="text-[#f5f5f5] text-sm mt-1">
            {items.length} project{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={openNew} disabled={createMutation.isPending}>
          {createMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Add Project
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-[#f5f5f5]" />
        </div>
      )}

      {error && (
        <div className="text-center py-24">
          <p className="text-red-400">Failed to load portfolio items.</p>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
            <Plus className="h-8 w-8 text-[#f5f5f5]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No portfolio items yet</h3>
          <p className="text-[#f5f5f5] mb-6 max-w-sm mx-auto">
            Get started by adding your first project to showcase your work.
          </p>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4 mr-2" /> Add Your First Project
          </Button>
        </div>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id} className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 transition-colors">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-24 h-16 shrink-0 rounded overflow-hidden bg-zinc-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-[#f5f5f5]">
                      {item.category}
                    </span>
                    {item.projectLink && (
                      <a
                        href={item.projectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 truncate"
                      >
                        {item.projectLink}
                      </a>
                    )}
                    {item.media && item.media.length > 1 && (
                      <span className="text-xs text-[#f5f5f5]">
                        +{item.media.length - 1} more
                      </span>
                    )}
                  </div>
                  <p className="text-[#f5f5f5] text-sm mt-1 line-clamp-1">{item.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href={`/admin/portfolio/${item.id}/edit`}>
                    <Button variant="ghost" size="icon" title="Edit Blocks">
                      <Layout className="h-4 w-4 text-[#f5f5f5] hover:text-white transition-colors" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)} title="Edit">
                    <Pencil className="h-4 w-4 text-[#f5f5f5] hover:text-white transition-colors" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(item)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300 transition-colors" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) closeForm(); }}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Project" : "Add New Project"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Project Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="bg-zinc-800 border-zinc-700"
                placeholder="e.g. My Brand Project"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-[#f5f5f5]">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Media Files (Images & Videos) *</Label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:border-[#A30A0A]/50 transition-colors bg-zinc-800/30"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleInputChange}
                  disabled={uploading}
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-[#A30A0A]" />
                    <span className="text-[#f5f5f5]">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-[#f5f5f5]" />
                    <span className="text-[#f5f5f5] font-medium">Drop files here or click to browse</span>
                    <span className="text-[#f5f5f5] text-sm/5">Supports images and videos (max 10MB each)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Media Previews */}
            {form.media.length > 0 && (
              <div className="space-y-2">
                <Label>
                  Media ({form.media.length} file{form.media.length !== 1 ? "s" : ""})
                  <span className="text-[#f5f5f5] text-xs ml-2">— first file is the cover</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {form.media.map((media, index) => (
                    <div
                      key={index}
                      className={`relative group rounded-lg overflow-hidden border ${
                        index === 0
                          ? "border-[#A30A0A] ring-1 ring-[#A30A0A]/50"
                          : "border-zinc-700"
                      } bg-zinc-800`}
                    >
                      {media.type === "video" || isVideoFile(media.url) ? (
                        <div className="aspect-video flex items-center justify-center bg-zinc-900">
                          <Film className="h-8 w-8 text-[#f5f5f5]" />
                        </div>
                      ) : (
                        <div className="aspect-video">
                          <img
                            src={media.url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-[#A30A0A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          COVER
                        </div>
                      )}
                      {media.type === "video" && (
                        <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Video className="h-3 w-3" /> VIDEO
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-white hover:bg-white/20"
                          onClick={(e) => { e.stopPropagation(); moveMedia(index, -1); }}
                          disabled={index === 0}
                          title="Move left"
                        >
                          <span className="text-lg font-bold">&lt;</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                          onClick={(e) => { e.stopPropagation(); removeMedia(index); }}
                          title="Remove"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-white hover:bg-white/20"
                          onClick={(e) => { e.stopPropagation(); moveMedia(index, 1); }}
                          disabled={index === form.media.length - 1}
                          title="Move right"
                        >
                          <span className="text-lg font-bold">&gt;</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="bg-zinc-800 border-zinc-700"
                placeholder="Describe your project..."
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tags (optional)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="Social Media, Print"
                />
              </div>
              <div className="space-y-2">
                <Label>Project Link (optional)</Label>
                <Input
                  value={form.projectLink}
                  onChange={(e) => setForm((p) => ({ ...p, projectLink: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="https://..."
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
                {editId ? "Save Changes" : "Add Project"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-[#f5f5f5]">
              Are you sure you want to delete <strong className="text-white">{deleteTarget?.title}</strong>?
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
