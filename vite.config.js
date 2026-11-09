import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

const root = path.dirname(fileURLToPath(import.meta.url));
const pageTemplates = {
  home: 'home.html',
  download: 'download.html',
  about: 'about.html',
  setup: 'setup.html',
  guide: 'guide.html'
};

function prerenderPageContent() {
  return {
    name: 'prerender-page-content',
    async transformIndexHtml(html) {
      const page = html.match(/<div id="root" data-page="([^"]+)"><\/div>/)?.[1];
      const templateName = pageTemplates[page];
      if (!templateName) return html;

      const templatePath = path.join(root, 'src', 'pages', templateName);
      const markup = fs.readFileSync(templatePath, 'utf8');

      const app = createSSRApp({
        render() {
          return h('div', { class: 'cm-site-root', innerHTML: markup });
        }
      });
      const rendered = await renderToString(app);
      return html.replace(
        `<div id="root" data-page="${page}"></div>`,
        `<div id="root" data-page="${page}">${rendered}</div>`
      );
    }
  };
}

function copyStaticSiteAssets() {
  const staticFiles = [
    'brand-logo.png',
    'brand-logo.webp',
    'favicon-180.png',
    'CM-RETAIL-OS-INSTALLER-v3.0.9.exe',
    'CM-RetailOS-User-Guide.pdf',
    'CM-SheetViewer-Setup-1.0.1.exe',
    'cmsheetviewer.png',
    'cmsheetviewer.webp',
    'google6fedcea8e00ca700.html',
    'google8dd80236be0e7340.html',
    'robots.txt',
    'sitemap.xml'
  ];

  return {
    name: 'copy-static-site-assets',
    closeBundle() {
      const outputDir = path.join(root, 'dist');
      for (const file of staticFiles) {
        fs.copyFileSync(path.join(root, file), path.join(outputDir, file));
      }
      fs.cpSync(path.join(root, 'images'), path.join(outputDir, 'images'), { recursive: true });
    }
  };
}

export default defineConfig({
  plugins: [vue(), prerenderPageContent(), copyStaticSiteAssets()],
  build: {
    rollupOptions: {
      input: {
        home: path.join(root, 'index.html'),
        download: path.join(root, 'download.html'),
        about: path.join(root, 'About.html'),
        setup: path.join(root, 'How to Setup.html'),
        guide: path.join(root, 'User Guide.html')
      }
    }
  }
});
