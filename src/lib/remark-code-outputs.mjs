const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

export default function remarkCodeOutputs() {
  return (tree, file) => {
    const outputs = file.data.astro?.frontmatter?.codeOutputs;
    if (!Array.isArray(outputs) || outputs.length === 0) return;

    let outputIndex = 0;

    const visit = (node) => {
      if (!Array.isArray(node.children)) return;

      const children = [];
      for (const child of node.children) {
        children.push(child);
        if (child.type === 'code' && child.lang === 'kotlin') {
          const executableCode = child.value.replace(/\/\/.*$/gm, '');
          if (!/\bprint(?:ln)?\s*\(/.test(executableCode)) {
            throw new Error(`Kotlin snippet ${outputIndex + 1} in ${file.path} has an output panel but never calls print or println`);
          }
          const output = outputs[outputIndex];
          if (typeof output !== 'string') {
            throw new Error(`Missing code output ${outputIndex + 1} in ${file.path}`);
          }
          children.push({
            type: 'html',
            value: `<div class="code-result"><span>Console output</span><pre><code>${escapeHtml(output)}</code></pre></div>`,
          });
          outputIndex += 1;
        } else {
          visit(child);
        }
      }
      node.children = children;
    };

    visit(tree);
    if (outputIndex !== outputs.length) {
      throw new Error(`Expected ${outputs.length} Kotlin snippets in ${file.path}, found ${outputIndex}`);
    }
  };
}
