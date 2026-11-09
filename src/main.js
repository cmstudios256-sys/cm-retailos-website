import { createSSRApp } from 'vue';
import App from './App.vue';
import '../style.css';

const pageTemplates = {
  home: () => import('./pages/home.html?raw'),
  download: () => import('./pages/download.html?raw'),
  about: () => import('./pages/about.html?raw'),
  setup: () => import('./pages/setup.html?raw'),
  guide: () => import('./pages/guide.html?raw')
};

const root = document.getElementById('root');
const page = root?.dataset.page;

if (root && page && pageTemplates[page]) {
  pageTemplates[page]().then(({ default: content }) => {
    const app = createSSRApp(App, { page, content });
    app.mount('#root');
  });
}
