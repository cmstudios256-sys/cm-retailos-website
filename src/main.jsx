import { useEffect } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { initializePageInteractions } from './page-interactions.js';
import { initAll } from '../theme.js';

const pageTemplates = {
  home: () => import('./pages/home.html?raw'),
  download: () => import('./pages/download.html?raw'),
  about: () => import('./pages/about.html?raw'),
  setup: () => import('./pages/setup.html?raw'),
  guide: () => import('./pages/guide.html?raw')
};

function Site({ page, content }) {
  useEffect(() => {
    initAll();
    return initializePageInteractions(page);
  }, [page]);

  return <App page={page} content={content} />;
}

const root = document.getElementById('root');
const page = root?.dataset.page;

if (root && page && pageTemplates[page]) {
  pageTemplates[page]().then(({ default: content }) => {
    hydrateRoot(root, <Site page={page} content={content} />);
  });
}
