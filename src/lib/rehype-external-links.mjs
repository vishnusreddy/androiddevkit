/**
 * Make external web links open in a new tab while leaving same-site and
 * non-web protocols (for example, mailto:) untouched.
 *
 * @param {{ site: string }} options
 */
export default function rehypeExternalLinks({ site }) {
  const siteOrigin = new URL(site).origin;

  return (tree) => {
    visit(tree, (node) => {
      if (node.tagName !== 'a' || typeof node.properties?.href !== 'string') return;

      const href = node.properties.href;
      let destination;

      try {
        destination = new URL(href, site);
      } catch {
        return;
      }

      if (!['http:', 'https:'].includes(destination.protocol) || destination.origin === siteOrigin) {
        return;
      }

      const existingRel = Array.isArray(node.properties.rel)
        ? node.properties.rel
        : String(node.properties.rel ?? '').split(/\s+/);
      const rel = new Set(existingRel.filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');

      node.properties.target = '_blank';
      node.properties.rel = [...rel];
    });
  };
}

function visit(node, callback) {
  if (!node || typeof node !== 'object') return;
  callback(node);

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => visit(child, callback));
  }
}
