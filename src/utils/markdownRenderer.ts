import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.headerLink() as any,
});

/**
 * MarkdownをHTMLに変換
 * 画像パスを修正（../img/ を適切なパスに変換）
 */
export function renderMarkdown(content: string): string {
  // ベースパスを取得（環境変数またはデフォルト値）
  // サブドメイン方式: /img/
  // サブディレクトリ方式: /knowledge/img/
  const basePath = (import.meta.env.BASE_URL as string) || '/';
  const imgPath = basePath === '/' ? '/img/' : `${basePath}img/`;
  
  // 画像パスを修正
  const processedContent = content.replace(
    /(!\[.*?\]\(\.\.\/img\/[^)]+\))/g,
    (match) => {
      return match.replace('../img/', imgPath);
    }
  ).replace(
    /(<img[^>]+src=["'])(\.\.\/img\/[^"']+)(["'][^>]*>)/g,
    (match, prefix, path, suffix) => {
      return prefix + path.replace('../img/', imgPath) + suffix;
    }
  );

  return md.render(processedContent);
}
