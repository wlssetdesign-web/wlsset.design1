import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Save, Eye, Plus, Trash2, ChevronUp, ChevronDown,
  Image, Columns2, Video, Text, Square, Loader2, Upload, X, GripVertical,
} from "lucide-react";

type ProjectBlock = {
  id: string;
  type: "full_image" | "two_column_images" | "video" | "text_block" | "divider";
  sortOrder: number;
  content: Record<string, any>;
};

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tags?: string;
  projectLink?: string;
  blocks?: ProjectBlock[];
};

const categories = ["Branding", "Print", "Social Media", "Image Editing", "Vector Tracing", "Infographic Design", "Video"];

function generateId() {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const blockTypes = [
  { value: "full_image", label: "Full-Width Image", icon: Image },
  { value: "two_column_images", label: "2-Column Images", icon: Columns2 },
  { value: "video", label: "Video", icon: Video },
  { value: "text_block", label: "Text Block", icon: Text },
  { value: "divider", label: "Divider", icon: Square },
] as const;

function createDefaultBlock(type: ProjectBlock["type"], sortOrder: number): ProjectBlock {
  const base = { id: generateId(), type, sortOrder, content: {} as Record<string, any> };
  switch (type) {
    case "full_image":
      return { ...base, content: { url: "", alt: "" } };
    case "two_column_images":
      return { ...base, content: { urls: ["", ""], alt: "" } };
    case "video":
      return { ...base, content: { url: "", autoPlay: true, muted: true, loop: true, controls: true } };
    case "text_block":
      return { ...base, content: { title: "", paragraph: "", textColor: "#ffffff", bgColor: "transparent" } };
    case "divider":
      return { ...base, content: { bgColor: "#1a1a1a" } };
    default:
      return base;
  }
}

export default function AdminProjectEditor() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Branding");
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [blocks, setBlocks] = useState<ProjectBlock[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { data: project, isLoading } = useQuery<PortfolioItem>({
    queryKey: [`/api/portfolio/${id}`],
    enabled: !!id,
  });

  useEffect(() => {
    if (project && !loaded) {
      setTitle(project.title);
      setCategory(project.category);
      setCoverImage(project.image);
      setDescription(project.description);
      setTags(project.tags || "");
      setProjectLink(project.projectLink || "");
      const sortedBlocks = (project.blocks || []).sort((a, b) => a.sortOrder - b.sortOrder);
      setBlocks(sortedBlocks);
      setLoaded(true);
    }
  }, [project, loaded]);

  function reindexBlocks(blks: ProjectBlock[]) {
    return blks.map((b, i) => ({ ...b, sortOrder: i }));
  }

  function addBlock(type: ProjectBlock["type"]) {
    const newBlock = createDefaultBlock(type, blocks.length);
    setBlocks((prev) => reindexBlocks([...prev, newBlock]));
  }

  function removeBlock(blockId: string) {
    setBlocks((prev) => reindexBlocks(prev.filter((b) => b.id !== blockId)));
  }

  function moveBlock(blockId: string, direction: -1 | 1) {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === blockId);
      if (idx === -1) return prev;
      const toIdx = idx + direction;
      if (toIdx < 0 || toIdx >= prev.length) return prev;
      const updated = [...prev];
      [updated[idx], updated[toIdx]] = [updated[toIdx], updated[idx]];
      return reindexBlocks(updated);
    });
  }

  function updateBlock(blockId: string, content: Record<string, any>) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, content: { ...b.content, ...content } } : b))
    );
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setCoverImage(data.url);
      toast({ title: "Cover uploaded" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  async function handleBlockImageUpload(
    blockId: string,
    field: string,
    file: File,
    index?: number,
  ) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== blockId) return b;
          if (field === "url") {
            return { ...b, content: { ...b.content, url: data.url } };
          }
          if (field === "urls" && typeof index === "number") {
            const urls = [...(b.content?.urls || [])];
            urls[index] = data.url;
            return { ...b, content: { ...b.content, urls } };
          }
          return b;
        })
      );
      toast({ title: "Image uploaded" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!title.trim() || !description.trim()) {
      toast({ title: "Validation error", description: "Title and description are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const reindexed = reindexBlocks(blocks);
      await apiRequest("PUT", `/api/portfolio/${id}`, {
        title,
        category,
        image: coverImage,
        description,
        tags: tags || undefined,
        projectLink: projectLink || undefined,
      });
      await apiRequest("PUT", `/api/portfolio/${id}/blocks`, { blocks: reindexed });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      queryClient.invalidateQueries({ queryKey: [`/api/portfolio/${id}`] });
      toast({ title: "Saved", description: "Project and blocks have been saved." });
    } catch {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function handlePreview() {
    window.open(`/portfolio/${id}`, "_blank");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#f5f5f5]" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-24">
        <p className="text-red-400">Project not found.</p>
        <Link href="/admin/portfolio" className="text-blue-400 hover:underline mt-4 inline-block">
          Back to portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/portfolio">
            <Button variant="ghost" size="icon" className="text-[#f5f5f5] hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{title || "Untitled Project"}</h1>
            <p className="text-[#f5f5f5] text-sm">Project Editor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview} className="border-zinc-700 text-[#f5f5f5] hover:text-white">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
        </div>
      </div>

      {/* Basic Info Section */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Basic Info</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                placeholder="e.g. My Brand Project"
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-[#f5f5f5]">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4">
              {coverImage && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 flex gap-2">
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 flex-1"
                  placeholder="Image URL"
                />
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-zinc-700 text-[#f5f5f5]"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
              placeholder="Short project description..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tags (optional)</Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                placeholder="Social Media, Print"
              />
            </div>
            <div className="space-y-2">
              <Label>Project Link (optional)</Label>
              <Input
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Builder Section */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Content Blocks</h2>
          <div className="flex gap-1">
            {blockTypes.map((bt) => {
              const Icon = bt.icon;
              return (
                <Button
                  key={bt.value}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addBlock(bt.value)}
                  className="text-[#f5f5f5] hover:text-white hover:bg-zinc-800"
                  title={`Add ${bt.label}`}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </div>

        {blocks.length === 0 && (
          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-12 text-center">
            <p className="text-[#f5f5f5] mb-2">No content blocks yet</p>
            <p className="text-[#f5f5f5] text-sm">
              Click the icons above to add images, videos, text, or dividers.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {blocks.map((block, index) => (
            <BlockEditor
              key={block.id}
              block={block}
              index={index}
              total={blocks.length}
              uploading={uploading}
              onUpdate={(content) => updateBlock(block.id, content)}
              onMoveUp={() => moveBlock(block.id, -1)}
              onMoveDown={() => moveBlock(block.id, 1)}
              onRemove={() => removeBlock(block.id)}
              onImageUpload={(file, field, idx) => handleBlockImageUpload(block.id, field, file, idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BlockEditor({
  block, index, total, uploading, onUpdate, onMoveUp, onMoveDown, onRemove, onImageUpload,
}: {
  block: ProjectBlock;
  index: number;
  total: number;
  uploading: boolean;
  onUpdate: (content: Record<string, any>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onImageUpload: (file: File, field: string, index?: number) => void;
}) {
  const typeLabel = blockTypes.find((bt) => bt.value === block.type)?.label || block.type;

  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/80 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-[#f5f5f5]" />
          <span className="text-sm font-medium text-white">{typeLabel}</span>
          <span className="text-xs text-[#f5f5f5]">#{index + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-[#f5f5f5]" onClick={onMoveUp} disabled={index === 0}>
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-[#f5f5f5]" onClick={onMoveDown} disabled={index === total - 1}>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={onRemove}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {block.type === "full_image" && (
          <ImageUrlInput
            label="Image"
            value={block.content?.url || ""}
            onChange={(url) => onUpdate({ url })}
            onFileSelect={(file) => onImageUpload(file, "url")}
            uploading={uploading}
          />
        )}

        {block.type === "two_column_images" && (
          <div className="grid grid-cols-2 gap-3">
            <ImageUrlInput
              label="Left Image"
              value={block.content?.urls?.[0] || ""}
              onChange={(url) => {
                const urls = [...(block.content?.urls || ["", ""])];
                urls[0] = url;
                onUpdate({ urls });
              }}
              onFileSelect={(file) => onImageUpload(file, "urls", 0)}
              uploading={uploading}
            />
            <ImageUrlInput
              label="Right Image"
              value={block.content?.urls?.[1] || ""}
              onChange={(url) => {
                const urls = [...(block.content?.urls || ["", ""])];
                urls[1] = url;
                onUpdate({ urls });
              }}
              onFileSelect={(file) => onImageUpload(file, "urls", 1)}
              uploading={uploading}
            />
          </div>
        )}

        {block.type === "video" && (
          <div className="space-y-3">
            <ImageUrlInput
              label="Video URL"
              value={block.content?.url || ""}
              onChange={(url) => onUpdate({ url })}
              onFileSelect={(file) => onImageUpload(file, "url")}
              uploading={uploading}
              accept="video/*"
            />
            <div className="flex gap-4">
              {(["autoPlay", "muted", "loop", "controls"] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-[#f5f5f5] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={block.content?.[opt] !== false}
                    onChange={(e) => onUpdate({ [opt]: e.target.checked })}
                    className="rounded border-zinc-600 bg-zinc-700"
                  />
                  {opt === "autoPlay" ? "Auto-play" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </label>
              ))}
            </div>
          </div>
        )}

        {block.type === "text_block" && (
          <div className="space-y-3">
            <Input
              value={block.content?.title || ""}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="bg-zinc-900 border-zinc-700"
              placeholder="Title (optional)"
            />
            <Textarea
              value={block.content?.paragraph || ""}
              onChange={(e) => onUpdate({ paragraph: e.target.value })}
              className="bg-zinc-900 border-zinc-700"
              placeholder="Paragraph text..."
              rows={3}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-[#f5f5f5]">Text Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.content?.textColor || "#ffffff"}
                    onChange={(e) => onUpdate({ textColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border border-zinc-700 bg-transparent"
                  />
                  <Input
                    value={block.content?.textColor || "#ffffff"}
                    onChange={(e) => onUpdate({ textColor: e.target.value })}
                    className="bg-zinc-900 border-zinc-700 font-mono text-xs flex-1"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-[#f5f5f5]">Background Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.content?.bgColor || "transparent"}
                    onChange={(e) => onUpdate({ bgColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border border-zinc-700 bg-transparent"
                  />
                  <Input
                    value={block.content?.bgColor || "transparent"}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdate({ bgColor: val || "transparent" });
                    }}
                    className="bg-zinc-900 border-zinc-700 font-mono text-xs flex-1"
                    placeholder="transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {block.type === "divider" && (
          <div className="space-y-1">
            <Label className="text-xs text-[#f5f5f5]">Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={block.content?.bgColor || "#1a1a1a"}
                onChange={(e) => onUpdate({ bgColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border border-zinc-700 bg-transparent"
              />
              <Input
                value={block.content?.bgColor || "#1a1a1a"}
                onChange={(e) => onUpdate({ bgColor: e.target.value })}
                className="bg-zinc-900 border-zinc-700 font-mono text-xs flex-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ImageUrlInput({
  label, value, onChange, onFileSelect, uploading, accept,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onFileSelect: (file: File) => void;
  uploading: boolean;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1">
      <Label className="text-xs text-[#f5f5f5]">{label}</Label>
      <div className="flex items-center gap-2">
        {value && (
          <div className="w-12 h-12 rounded overflow-hidden bg-zinc-900 shrink-0">
            {accept?.includes("video") ? (
              <video src={value} className="w-full h-full object-cover" />
            ) : (
              <img src={value} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
          </div>
        )}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-900 border-zinc-700 flex-1"
          placeholder="Paste URL..."
        />
        <input
          ref={inputRef}
          type="file"
          accept={accept || "image/*"}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="border-zinc-700 text-[#f5f5f5] shrink-0"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
