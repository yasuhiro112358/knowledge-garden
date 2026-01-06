import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
// 決定: サブドメイン方式 (knowledge.newtralize.com)
export default defineConfig({
  site: 'https://knowledge.newtralize.com',
  base: '/',  // サブドメインのためベースパスはルート
  integrations: [mdx(), tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});

