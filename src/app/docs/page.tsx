import Link from "next/link";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

async function listDocs() {
  const dir = path.join(process.cwd(), "docs");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".md")).sort();
  return Promise.all(
    files.map(async (f) => {
      const content = await fs.readFile(path.join(dir, f), "utf-8");
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const slug = f.replace(/\.md$/, "");
      const intro = content.split("\n").find((l) => l.trim() && !l.startsWith("#") && !l.startsWith("```")) ?? "";
      return { slug, file: f, title: titleMatch?.[1] ?? slug, intro };
    }),
  );
}

export default async function DocsIndex() {
  const docs = await listDocs();
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-accent font-mono text-sm mb-2">// module 05</p>
        <h1 className="text-3xl font-bold mb-2">架构文档</h1>
        <p className="text-muted text-sm">本项目的技术原理与设计取舍。源码在 <code className="text-accent">/docs</code>。</p>
      </div>

      <div className="space-y-3">
        {docs.map((d) => (
          <Link
            key={d.slug}
            href={`/docs/${d.slug}`}
            className="card p-5 block hover:border-accent group transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-semibold group-hover:text-accent">{d.title}</h2>
              <span className="text-muted group-hover:text-accent">→</span>
            </div>
            <p className="text-sm text-muted line-clamp-2">{d.intro}</p>
            <div className="text-xs text-muted font-mono mt-2">{d.file}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
