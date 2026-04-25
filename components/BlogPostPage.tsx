import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarBlank } from '@phosphor-icons/react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import 'highlight.js/styles/github.css';
import { getPostBySlug } from '../lib/posts';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeHighlight as never, { ignoreMissing: true } as never)
  .use(rehypeStringify);

async function renderMarkdown(md: string): Promise<string> {
  const file = await processor.process(md);
  return String(file);
}

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    if (!post) return;
    let cancelled = false;
    renderMarkdown(post.content).then(out => {
      if (!cancelled) setHtml(out);
    });
    return () => { cancelled = true; };
  }, [post]);

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
          <span>返回博客</span>
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

        {/* Article content */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      {/* Minimal footer */}
      <footer className="max-w-3xl mx-auto px-6 pb-12 border-t border-zinc-200 dark:border-zinc-800 pt-8 flex justify-between text-xs font-mono text-zinc-400 tracking-widest">
        <span>&copy; 2024-{new Date().getFullYear()} DAMUE</span>
        <button
          onClick={() => navigate('/')}
          className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors uppercase"
        >
          Back to blog
        </button>
      </footer>
    </motion.div>
  );
};

export default BlogPostPage;
