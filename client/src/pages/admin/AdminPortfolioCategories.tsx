import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Tags, X, Plus, Pencil } from "lucide-react";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  tags?: string | null;
};

export default function AdminPortfolioCategories() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const { data: items = [], isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, tags }: { id: string; tags: string }) =>
      apiRequest("PUT", `/api/portfolio/${id}`, { tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setEditingId(null);
      setTagInput("");
      toast({ title: "Tags updated", description: "Portfolio tags have been saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update tags.", variant: "destructive" });
    },
  });

  function startEdit(item: PortfolioItem) {
    setEditingId(item.id);
    setTagInput(item.tags || "");
  }

  function handleSave(id: string) {
    const cleaned = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .join(", ");
    if (!cleaned) {
      toast({ title: "Validation", description: "Please enter at least one tag.", variant: "destructive" });
      return;
    }
    updateMutation.mutate({ id, tags: cleaned });
  }

  function extractTags(tags?: string | null): string[] {
    if (!tags) return [];
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }

  const allTags = Array.from(
    new Set(items.flatMap((item) => extractTags(item.tags)))
  ).sort();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Categories</h1>
          <p className="text-[#f5f5f5] text-sm mt-1">
            {items.length} project{items.length !== 1 ? "s" : ""}
            {allTags.length > 0 && ` · ${allTags.length} tag${allTags.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Tag cloud */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#f5f5f5] mb-2 flex items-center gap-2">
            <Tags className="h-4 w-4" /> All tags in use
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-[#f5f5f5] border border-zinc-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-[#f5f5f5]" />
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
            <Tags className="h-8 w-8 text-[#f5f5f5]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No portfolio items yet</h3>
          <p className="text-[#f5f5f5] mb-6 max-w-sm mx-auto">
            Add portfolio items first, then you can assign tags/categories to them.
          </p>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div className="grid gap-3">
          {items.map((item) => {
            const tags = extractTags(item.tags);
            const isEditing = editingId === item.id;
            return (
              <Card key={item.id} className="bg-zinc-900/60 border-zinc-800">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-16 h-12 shrink-0 rounded overflow-hidden bg-zinc-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">{item.title}</h3>
                    <p className="text-[#f5f5f5] text-xs mt-0.5">Category: {item.category}</p>
                    {!isEditing && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {tags.length > 0 ? tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#A30A0A]/20 text-[#A30A0A] border border-[#A30A0A]/30"
                          >
                            {tag}
                          </span>
                        )) : (
                          <span className="text-xs text-zinc-500 italic">No tags assigned</span>
                        )}
                      </div>
                    )}
                    {isEditing && (
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="e.g. Business Cards, Logo, Print"
                          className="h-8 text-xs bg-zinc-800 border-zinc-700 text-white flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave(item.id);
                            if (e.key === "Escape") { setEditingId(null); setTagInput(""); }
                          }}
                        />
                        <Button
                          size="sm"
                          className="h-8 text-xs bg-[#A30A0A] hover:bg-[#8B0808]"
                          onClick={() => handleSave(item.id)}
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs text-[#f5f5f5]"
                          onClick={() => { setEditingId(null); setTagInput(""); }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-[#f5f5f5] hover:text-white"
                      onClick={() => startEdit(item)}
                      title="Edit tags"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
