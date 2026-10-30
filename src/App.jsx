import { renderPageContent } from './render-page-content.js';

export default function App({ page, content }) {
  if (!content) {
    return <main className="container"><h1>Page not found</h1></main>;
  }

  return renderPageContent(content);
}
