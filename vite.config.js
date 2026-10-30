import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { renderPageContent } from './src/render-page-content.js';

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
    transformIndexHtml(html) {
      const page = html.match(/<div id="root" data-page="([^"]+)"><\/div>/)?.[1];
      const templateName = pageTemplates[page];
      if (!templateName) return html;

      const templatePath = path.join(root, 'src', 'pages', templateName);
      const markup = fs.readFileSync(templatePath, 'utf8');
      const rendered = renderToString(React.createElement(React.Fragment, null, renderPageContent(markup)));
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
    'CM-RETAIL-OS-INSTALLER-v3.0.8.exe',
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
  plugins: [react(), prerenderPageContent(), copyStaticSiteAssets()],
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
