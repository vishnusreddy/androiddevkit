import { Editor } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  CodeXml,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  SquareCode,
  Undo2,
  createElement as createIconElement,
  type IconNode,
} from 'lucide';

type EditorAction = {
  icon: IconNode;
  title: string;
  group: number;
  run: (editor: Editor) => void;
  active?: (editor: Editor) => boolean;
};

const actions: EditorAction[] = [
  {
    icon: Undo2,
    title: 'Undo',
    group: 0,
    run: (editor) => editor.chain().focus().undo().run(),
  },
  {
    icon: Redo2,
    title: 'Redo',
    group: 0,
    run: (editor) => editor.chain().focus().redo().run(),
  },
  {
    icon: Bold,
    title: 'Bold',
    group: 1,
    run: (editor) => editor.chain().focus().toggleBold().run(),
    active: (editor) => editor.isActive('bold'),
  },
  {
    icon: Italic,
    title: 'Italic',
    group: 1,
    run: (editor) => editor.chain().focus().toggleItalic().run(),
    active: (editor) => editor.isActive('italic'),
  },
  {
    icon: CodeXml,
    title: 'Inline code',
    group: 1,
    run: (editor) => editor.chain().focus().toggleCode().run(),
    active: (editor) => editor.isActive('code'),
  },
  {
    icon: Link2,
    title: 'Link',
    group: 1,
    run: (editor) => {
      const previous = editor.getAttributes('link').href as string | undefined;
      const href = window.prompt('Link URL', previous ?? 'https://');
      if (href === null) return;
      if (!href.trim()) {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: href.trim() }).run();
    },
    active: (editor) => editor.isActive('link'),
  },
  {
    icon: Heading2,
    title: 'Heading 2',
    group: 2,
    run: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    active: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    icon: Heading3,
    title: 'Heading 3',
    group: 2,
    run: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    active: (editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    icon: List,
    title: 'Bulleted list',
    group: 3,
    run: (editor) => editor.chain().focus().toggleBulletList().run(),
    active: (editor) => editor.isActive('bulletList'),
  },
  {
    icon: ListOrdered,
    title: 'Numbered list',
    group: 3,
    run: (editor) => editor.chain().focus().toggleOrderedList().run(),
    active: (editor) => editor.isActive('orderedList'),
  },
  {
    icon: Quote,
    title: 'Quote',
    group: 3,
    run: (editor) => editor.chain().focus().toggleBlockquote().run(),
    active: (editor) => editor.isActive('blockquote'),
  },
  {
    icon: SquareCode,
    title: 'Code block',
    group: 4,
    run: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    active: (editor) => editor.isActive('codeBlock'),
  },
  {
    icon: Minus,
    title: 'Horizontal rule',
    group: 4,
    run: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
];

function fieldLabel(textarea: HTMLTextAreaElement) {
  return (
    textarea
      .closest('.field')
      ?.querySelector(':scope > label, :scope > span')
      ?.textContent?.replace('*', '')
      .trim() ||
    textarea.name ||
    'Content'
  );
}

function createToolbar() {
  const toolbar = document.createElement('div');
  toolbar.className = 'rich-editor-toolbar';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Text formatting');
  return toolbar;
}

function enhanceTextarea(textarea: HTMLTextAreaElement) {
  if (textarea.dataset.editorReady === 'true') return;

  const label = textarea.closest('.field')?.querySelector<HTMLLabelElement>(':scope > label');
  if (label && !label.id) label.id = `${textarea.id || textarea.name}-editor-label`;

  const shell = document.createElement('div');
  shell.className = 'rich-editor';
  shell.style.setProperty('--editor-min-height', `${Math.max(140, textarea.rows * 19)}px`);

  const toolbar = createToolbar();
  const surface = document.createElement('div');
  surface.className = 'rich-editor-surface';
  shell.append(toolbar, surface);
  textarea.before(shell);

  const originalRequired = textarea.required;
  textarea.required = false;
  textarea.dataset.richRequired = String(originalRequired);
  textarea.dataset.editorReady = 'true';
  textarea.classList.add('rich-editor-source');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.tabIndex = -1;

  const editor = new Editor({
    element: surface,
    extensions: [
      StarterKit.configure({
        link: {
          autolink: true,
          defaultProtocol: 'https',
          openOnClick: false,
        },
      }),
      Placeholder.configure({ placeholder: textarea.placeholder }),
      Markdown.configure({ markedOptions: { gfm: true } }),
    ],
    content: textarea.value,
    contentType: 'markdown',
    editorProps: {
      attributes: {
        ...(label
          ? { 'aria-labelledby': label.id }
          : { 'aria-label': `${fieldLabel(textarea)} rich text editor` }),
        class: 'rich-editor-content',
      },
    },
    onUpdate: ({ editor }) => {
      textarea.value = editor.getMarkdown();
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      if (textarea.value.trim()) shell.classList.remove('is-invalid');
    },
  });

  const buttons = actions.map((action, index) => {
    if (index > 0 && actions[index - 1].group !== action.group) {
      const divider = document.createElement('span');
      divider.className = 'rich-editor-divider';
      divider.setAttribute('aria-hidden', 'true');
      toolbar.append(divider);
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'rich-editor-button';
    button.title = action.title;
    button.setAttribute('aria-label', action.title);
    button.append(
      createIconElement(action.icon, {
        width: '18',
        height: '18',
        'stroke-width': '2',
        'aria-hidden': 'true',
        class: 'rich-editor-icon',
      }),
    );
    button.addEventListener('click', () => action.run(editor));
    toolbar.append(button);
    return { action, button };
  });

  const refreshToolbar = () => {
    buttons.forEach(({ action, button }) => {
      const active = action.active?.(editor) ?? false;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  editor.on('selectionUpdate', refreshToolbar);
  editor.on('transaction', refreshToolbar);
  label?.addEventListener('click', (event) => {
    event.preventDefault();
    editor.commands.focus();
  });
  refreshToolbar();
}

export function initializeRichEditors(root: ParentNode = document) {
  root.querySelectorAll<HTMLTextAreaElement>('textarea[data-rich-editor]').forEach(enhanceTextarea);
}
