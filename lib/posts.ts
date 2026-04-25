// Blog post loader: reads markdown files from content/posts at build time
// via Vite's `import.meta.glob` and parses YAML-ish frontmatter without
// pulling Node-only deps (gray-matter) into the browser bundle.

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  cover: string;
  content: string;
}

// Eager raw imports — content is inlined into the bundle at build time.
const rawModules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

/** Parse a tiny subset of YAML used in our frontmatter (string + array). */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, unknown> = {};
  const lines = match[1].split(/\r?\n/);

  for (const line of lines) {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();

    // Array form: ["a", "b"] or [a, b]
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1).trim();
      data[key] = inner
        ? inner.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''))
        : [];
      continue;
    }

    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, content: match[2] };
}

function slugFromPath(filePath: string): string {
  const file = filePath.split('/').pop() ?? '';
  return file.replace(/\.md$/, '');
}

const posts: BlogPost[] = Object.entries(rawModules)
  .map(([filePath, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    return {
      slug: slugFromPath(filePath),
      title: (data.title as string) ?? slugFromPath(filePath),
      date: (data.date as string) ?? '',
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      description: (data.description as string) ?? '',
      cover: (data.cover as string) ?? '',
      content,
    };
  })
  // newest first
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export const blogPosts = posts;

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find(p => p.slug === slug);
}
