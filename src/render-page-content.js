import parse from 'html-react-parser';

export function renderPageContent(markup) {
  const normalizedMarkup = markup.replace(/\r\n?/g, '\n');

  return parse(normalizedMarkup, {
    replace(node) {
      if (node.type === 'tag' && node.attribs.fetchpriority) {
        node.attribs.fetchPriority = node.attribs.fetchpriority;
        delete node.attribs.fetchpriority;
      }
    }
  });
}
