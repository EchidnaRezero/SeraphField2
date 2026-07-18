import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import { marked } from 'marked';
import {
  contentRelpathForWikiRelpath,
  fromWikiRelpathToJsonRelpath,
  toPosix,
  wikiRoot,
} from './paths.mjs';

export const categories = new Set(['THEORY', 'PAPER', 'REPO', 'IMPLEMENT', 'PROFILE']);
export const layouts = new Set(['wiki', 'standalone']);
export const roles = new Set([
  'content',
  'profile',
  'not-found',
  'content-unavailable',
  'empty-category',
]);

export const slugify = (value) =>
  String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s/-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/-+/g, '-');

const titleize = (value) =>
  value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const formatDate = (value) => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string' && value.trim()) {
    return value.slice(0, 10);
  }

  return '';
};

export const tokenText = (token) =>
  typeof token?.text === 'string' ? token.text.replace(/<[^>]+>/g, '').trim() : '';

const findFirstHeading = (tokens, depth) => {
  const token = tokens.find((item) => item.type === 'heading' && item.depth === depth);
  return tokenText(token);
};

const findSummary = (tokens) => {
  const paragraph = tokens.find((item) => item.type === 'paragraph' && tokenText(item));
  return tokenText(paragraph);
};

export const parseSections = (markdown) => {
  const tokens = marked.lexer(markdown);
  const sections = [];
  let current = null;

  const pushCurrent = () => {
    if (!current) {
      return;
    }

    const sectionMarkdown = current.markdownParts.join('').trim();
    sections.push({
      id: current.id,
      title: current.title,
      markdown: sectionMarkdown,
    });
  };

  tokens.forEach((token) => {
    if (token.type === 'heading' && token.depth === 1) {
      return;
    }

    if (token.type === 'heading' && token.depth === 2) {
      pushCurrent();
      const title = tokenText(token);
      current = {
        id: slugify(title) || `section-${sections.length + 1}`,
        title,
        tokens: [],
        markdownParts: [],
      };
      return;
    }

    if (current) {
      current.tokens.push(token);
      current.markdownParts.push(typeof token.raw === 'string' ? token.raw : tokenText(token));
    }
  });

  pushCurrent();

  if (sections.length > 0) {
    return sections;
  }

  const fallbackTokens = tokens.filter(
    (token) => !(token.type === 'heading' && token.depth === 1),
  );

  return [
    {
      id: 'overview',
      title: 'Overview',
      markdown: fallbackTokens
        .map((token) => (typeof token.raw === 'string' ? token.raw : tokenText(token)))
        .join('')
        .trim(),
    },
  ];
};

export const walkMarkdown = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdown(absolute)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(absolute);
    }
  }

  return files;
};

const normalizeSeries = (data) => {
  const value = data.series;
  const legacyTitle =
    typeof data.series_title === 'string' && data.series_title.trim()
      ? data.series_title.trim()
      : typeof data.seriesTitle === 'string' && data.seriesTitle.trim()
        ? data.seriesTitle.trim()
        : '';
  const legacyOrderValue = data.series_order ?? data.seriesOrder;
  const legacyOrder = Number.isFinite(Number(legacyOrderValue))
    ? Number(legacyOrderValue)
    : undefined;

  if (typeof value === 'string' && value.trim()) {
    return {
      id: slugify(value),
      title: legacyTitle || value.trim(),
      order: legacyOrder ?? 0,
    };
  }

  if (typeof value === 'object' && value !== null) {
    const id = typeof value.id === 'string' && value.id.trim()
      ? slugify(value.id)
      : typeof value.title === 'string'
        ? slugify(value.title)
        : '';

    if (!id) {
      return undefined;
    }

    return {
      id,
      title: typeof value.title === 'string' && value.title.trim() ? value.title.trim() : titleize(id),
      description: typeof value.description === 'string' ? value.description : undefined,
      order: Number.isFinite(Number(value.order)) ? Number(value.order) : legacyOrder ?? 0,
      sortOrder: Number.isFinite(Number(value.sort_order ?? value.sortOrder))
        ? Number(value.sort_order ?? value.sortOrder)
        : undefined,
    };
  }

  return undefined;
};

const normalizeRepository = (value) => {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const name = typeof value.name === 'string' && value.name.trim() ? value.name.trim() : '';

  if (!name) {
    return undefined;
  }

  return {
    owner: typeof value.owner === 'string' ? value.owner.trim() : '',
    name,
    url: typeof value.url === 'string' ? value.url.trim() : '',
    description: typeof value.description === 'string' ? value.description.trim() : undefined,
    homepageUrl:
      typeof value.homepage_url === 'string'
        ? value.homepage_url.trim()
        : typeof value.homepageUrl === 'string'
          ? value.homepageUrl.trim()
          : undefined,
    defaultBranch:
      typeof value.default_branch === 'string'
        ? value.default_branch.trim()
        : typeof value.defaultBranch === 'string'
          ? value.defaultBranch.trim()
          : undefined,
    version: typeof value.version === 'string' ? value.version.trim() : undefined,
    checkedAt:
      formatDate(value.checked_at ?? value.checkedAt) || new Date().toISOString().slice(0, 10),
  };
};

export const documentFromMarkdown = async (absolutePath) => {
  const raw = await fs.readFile(absolutePath, 'utf8');
  const parsed = matter(raw);
  const stat = await fs.stat(absolutePath);
  const relativeWikiPath = toPosix(path.relative(wikiRoot, absolutePath));
  const relativeWithoutExt = relativeWikiPath.replace(/\.md$/i, '');
  const slug = parsed.data.slug ? String(parsed.data.slug) : relativeWithoutExt;
  const firstSegment = relativeWithoutExt.split('/')[0]?.toUpperCase() ?? '';
  const category = String(parsed.data.category ?? firstSegment).toUpperCase();
  const tokens = marked.lexer(parsed.content);
  const title =
    typeof parsed.data.title === 'string' && parsed.data.title.trim()
      ? parsed.data.title.trim()
      : findFirstHeading(tokens, 1) || titleize(path.basename(relativeWithoutExt));
  const summary =
    typeof parsed.data.summary === 'string' && parsed.data.summary.trim()
      ? parsed.data.summary.trim()
      : findSummary(tokens);
  const sections = parseSections(parsed.content);
  const layoutValue = String(parsed.data.layout ?? 'wiki').toLowerCase();
  const roleValue = String(parsed.data.role ?? 'content').toLowerCase();

  return {
    slug,
    title,
    summary,
    category: categories.has(category) ? category : 'THEORY',
    layout: layouts.has(layoutValue) ? layoutValue : 'wiki',
    role: roles.has(roleValue) ? roleValue : 'content',
    wikiRelpath: relativeWikiPath,
    contentRelpath: contentRelpathForWikiRelpath(relativeWikiPath),
    createdAt:
      formatDate(parsed.data.created_at ?? parsed.data.createdAt) ||
      stat.birthtime.toISOString().slice(0, 10),
    updatedAt:
      formatDate(parsed.data.updated_at ?? parsed.data.updatedAt) ||
      stat.mtime.toISOString().slice(0, 10),
    tags: toArray(parsed.data.tags),
    groups: toArray(parsed.data.groups),
    series: normalizeSeries(parsed.data),
    repository: normalizeRepository(parsed.data.repository),
    roadmap: sections.map((section) => section.title),
    sections,
    markdown: parsed.content,
    contentHash: crypto.createHash('sha256').update(parsed.content).digest('hex'),
    outputRelativePath: fromWikiRelpathToJsonRelpath(relativeWikiPath),
  };
};
