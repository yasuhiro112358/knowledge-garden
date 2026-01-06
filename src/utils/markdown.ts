import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Topic {
  slug: string;
  title: string;
  content: string;
  data: {
    title?: string;
    date?: string;
    tags?: string[];
  };
}

export interface DailyNote {
  slug: string;
  title: string;
  content: string;
  date: string;
}

/**
 * topicsディレクトリからすべてのトピックを取得
 */
export async function getTopics(): Promise<Topic[]> {
  const topicsDir = path.join(process.cwd(), 'topics');
  const files = fs.readdirSync(topicsDir).filter((file) => file.endsWith('.md'));

  const topics = files.map((file) => {
    const filePath = path.join(topicsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const slug = file.replace('.md', '');

    // タイトルがfrontmatterにない場合は、最初のH1から取得
    let title = data.title || slug;
    if (!data.title) {
      const titleMatch = content.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        title = titleMatch[1].trim();
      }
    }

    return {
      slug,
      title,
      content,
      data: {
        ...data,
        title,
      },
    };
  });

  // タイトルでソート
  return topics.sort((a, b) => a.title.localeCompare(b.title, 'ja'));
}

/**
 * 特定のトピックを取得
 */
export async function getTopic(slug: string): Promise<Topic | null> {
  const topics = await getTopics();
  return topics.find((topic) => topic.slug === slug) || null;
}

/**
 * dailyディレクトリからすべての日次ノートを取得
 */
export async function getDailyNotes(): Promise<DailyNote[]> {
  const dailyDir = path.join(process.cwd(), 'daily');
  if (!fs.existsSync(dailyDir)) {
    return [];
  }

  const files = fs
    .readdirSync(dailyDir)
    .filter((file) => file.endsWith('.md'))
    .sort()
    .reverse(); // 新しい順

  const notes = files.map((file) => {
    const filePath = path.join(dailyDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const slug = file.replace('.md', '');

    // タイトルがfrontmatterにない場合は、最初のH1またはファイル名から取得
    let title = data.title || slug;
    if (!data.title) {
      const titleMatch = content.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        title = titleMatch[1].trim();
      }
    }

    return {
      slug,
      title,
      content,
      date: data.date || slug,
    };
  });

  return notes;
}

/**
 * 特定の日次ノートを取得
 */
export async function getDailyNote(slug: string): Promise<DailyNote | null> {
  const notes = await getDailyNotes();
  return notes.find((note) => note.slug === slug) || null;
}

