import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

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

export default function ProjectDetail() {
  const { id } = useParams();
  const { t } = useI18n();

  const { data: project, isLoading, error } = useQuery<PortfolioItem>({
    queryKey: [`/api/portfolio/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#A30A0A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4 text-white">
        <p className="text-xl">Project not found</p>
        <Link href="/portfolio" className="text-[#A30A0A] hover:underline">
          Back to portfolio
        </Link>
      </div>
    );
  }

  const blocks = (project.blocks || []).sort((a, b) => a.sortOrder - b.sortOrder);

  function renderBlock(block: ProjectBlock) {
    switch (block.type) {
      case "full_image":
        return <FullImageBlock block={block} />;
      case "two_column_images":
        return <TwoColumnImagesBlock block={block} />;
      case "video":
        return <VideoBlock block={block} />;
      case "text_block":
        return <TextBlock block={block} />;
      case "divider":
        return <DividerBlock block={block} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10" />
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12">
          <div className="max-w-5xl w-full">
            <Link href="/portfolio">
              <span className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                Back to portfolio
              </span>
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white mb-3 text-left"
            >
              {project.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white/80">
                {project.category}
              </span>
              <p className="text-white/60 text-lg">{project.description}</p>
              {project.projectLink && (
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#A30A0A] hover:underline text-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Project
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Blocks */}
      <div className="mx-auto">
        {blocks.length > 0 ? (
          blocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              {renderBlock(block)}
            </motion.div>
          ))
        ) : (
          <div className="max-w-5xl mx-auto px-4 py-20">
            <p className="text-white/40 text-center text-lg">
              No content blocks yet.
            </p>
          </div>
        )}
      </div>

      {/* Footer spacer */}
      <div className="h-24" />
    </div>
  );
}

function FullImageBlock({ block }: { block: ProjectBlock }) {
  const url = block.content?.url || block.content?.urls?.[0];
  if (!url) return null;
  return (
    <div className="bg-white">
      <div className="flex items-center justify-center px-4 py-12 md:py-20">
        <img
          src={url}
          alt={block.content?.alt || ""}
          className="w-full max-w-6xl object-contain"
        />
      </div>
    </div>
  );
}

function TwoColumnImagesBlock({ block }: { block: ProjectBlock }) {
  const urls = block.content?.urls || [];
  if (urls.length === 0) return null;
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {urls.map((url: string, i: number) => (
            <img
              key={i}
              src={url}
              alt={`${block.content?.alt || ""} ${i + 1}`}
              className="w-full object-contain rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoBlock({ block }: { block: ProjectBlock }) {
  const url = block.content?.url;
  if (!url) return null;
  const autoPlay = block.content?.autoPlay !== false;
  const muted = block.content?.muted !== false;
  const loop = block.content?.loop !== false;
  const controls = block.content?.controls !== false;

  return (
    <div className="bg-black">
      <div className="flex items-center justify-center px-4 py-12 md:py-20">
        <video
          src={url}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          className="w-full max-w-6xl max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
}

function TextBlock({ block }: { block: ProjectBlock }) {
  const bgColor = block.content?.bgColor || "transparent";
  const textColor = block.content?.textColor || "#ffffff";
  const title = block.content?.title || "";
  const paragraph = block.content?.paragraph || "";

  return (
    <div style={{ backgroundColor: bgColor }}>
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        {title && (
          <h2
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ color: textColor }}
          >
            {title}
          </h2>
        )}
        {paragraph && (
          <p
            className="text-lg md:text-xl leading-relaxed"
            style={{ color: textColor }}
          >
            {paragraph}
          </p>
        )}
      </div>
    </div>
  );
}

function DividerBlock({ block }: { block: ProjectBlock }) {
  const bgColor = block.content?.bgColor || "#1a1a1a";
  return (
    <div className="h-16 md:h-24" style={{ backgroundColor: bgColor }} />
  );
}
