import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarBlank } from '@phosphor-icons/react';
import { getPostBySlug } from '../lib/posts';

/** Robust line-by-line Markdown → HTML renderer */
function renderMarkdown(md: string): string {
  // 1) Code blocks (fenced)
  const codeBlocks: string[] = [];
  let src = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    codeBlocks.push(`<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`);
    return `\x00CB${codeBlocks.length - 1}\x00`;
  });

  const lines = src.split('\n');
  const html: string[] = [];
  let inList: 'ul' | 'ol' | null = null;

  const inline = (s: string) =>
    s
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

  const flushList = () => {
    if (inList) { html.push(`</${inList}>`); inList = null; }
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimEnd();

    // Code block placeholder
    const cbMatch = line.match(/^\x00CB(\d+)\x00$/);
    if (cbMatch) { flushList(); html.push(codeBlocks[+cbMatch[1]]); continue; }

    // Empty line
    if (!line.trim()) { flushList(); continue; }

    // Headings
    const h4 = line.match(/^####\s+(.*)/);
    if (h4) { flushList(); html.push(`<h4>${inline(h4[1])}</h4>`); continue; }
    const h3 = line.match(/^###\s+(.*)/);
    if (h3) { flushList(); html.push(`<h3>${inline(h3[1])}</h3>`); continue; }
    const h2 = line.match(/^##\s+(.*)/);
    if (h2) { flushList(); html.push(`<h2>${inline(h2[1])}</h2>`); continue; }
    const h1 = line.match(/^#\s+(.*)/);
    if (h1) { flushList(); html.push(`<h1>${inline(h1[1])}</h1>`); continue; }

    // Unordered list
    const ul = line.match(/^[\-\*]\s+(.*)/);
    if (ul) {
      if (inList !== 'ul') { flushList(); html.push('<ul>'); inList = 'ul'; }
      html.push(`<li>${inline(ul[1])}</li>`);
      continue;
    }

    // Ordered list
    const ol = line.match(/^\d+\.\s+(.*)/);
    if (ol) {
      if (inList !== 'ol') { flushList(); html.push('<ol>'); inList = 'ol'; }
      html.push(`<li>${inline(ol[1])}</li>`);
      continue;
    }

    // Paragraph: collect consecutive non-special lines
    flushList();
    const pLines = [line];
    while (i + 1 < lines.length) {
      const next = lines[i + 1].trimEnd();
      if (!next.trim() || /^#{1,4}\s|^[\-\*]\s|^\d+\.\s|^\x00CB/.test(next)) break;
      pLines.push(next);
      i++;
    }
    html.push(`<p>${inline(pLines.join('<br/>'))}</p>`);
  }
  flushList();
  return html.join('\n');
}

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-zinc-950 dark:text-zinc-50 tracking-tighter">404</h1>
          <p className="text-zinc-500 mb-8 text-lg">文章未找到</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all text-sm font-medium"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[100dvh] bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50"
    >
      {/* Back navigation */}
      <nav className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-all text-sm font-medium shadow-sm"
        >
          <ArrowLeft size={16} weight="bold" />
          <span>返回</span>
        </button>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <header className="mb-16">
          <div className="flex gap-2 mb-6">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 border border-zinc-200 dark:border-zinc-800 text-zinc-500"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-8">
            {post.title}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 max-w-[65ch]">
            {post.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-400 font-mono">
            <CalendarBlank size={14} />
            <time>{post.date}</time>
          </div>
        </header>

        {/* Cover */}
        <div className="aspect-video overflow-hidden rounded-2xl mb-16 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Article content */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
      </article>

      {/* Minimal footer */}
      <footer className="max-w-3xl mx-auto px-6 pb-12 border-t border-zinc-200 dark:border-zinc-800 pt-8 flex justify-between text-xs font-mono text-zinc-400 tracking-widest">
        <span>&copy; 2024-2025 DAMUE</span>
        <button
          onClick={() => { navigate('/'); window.scrollTo({ top: 0 }); }}
          className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors uppercase"
        >
          Back to top
        </button>
      </footer>
    </motion.div>
  );
};

export default BlogPostPage;
