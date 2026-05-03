import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { marked } from "marked";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DocPage({ params }: { params: { slug: string } }) {
  const file = path.join(process.cwd(), "docs", `${params.slug}.md`);
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf-8");
  } catch {
    return notFound();
  }
  const html = marked.parse(raw, { async: false }) as string;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/docs" className="text-sm text-muted hover:text-accent">← 返回文档列表</Link>
      <article
        className="prose-doc mt-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
