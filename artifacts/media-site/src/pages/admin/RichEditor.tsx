import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useRef, useState } from "react";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const ToolbarBtn = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
    className={`p-1.5 rounded text-sm transition leading-none ${
      active
        ? "bg-zinc-600 text-white"
        : "text-zinc-400 hover:text-white hover:bg-zinc-700"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-zinc-700 mx-1 self-center" />;

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Placeholder.configure({ placeholder: "Start writing your article here…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-zinc max-w-none min-h-[320px] px-5 py-4 focus:outline-none text-zinc-100 text-sm leading-relaxed",
      },
    },
  });

  // Sync external value changes (e.g. when form resets or new article loads)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false, { preserveWhitespace: "full" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  function insertImage() {
    if (!imageUrl.trim()) return;
    editor?.chain().focus().setImage({ src: imageUrl.trim() }).run();
    setImageUrl("");
    setShowImageInput(false);
  }

  function insertLink() {
    if (!linkUrl.trim()) {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    const url = linkUrl.trim().startsWith("http") ? linkUrl.trim() : `https://${linkUrl.trim()}`;
    editor?.chain().focus().setLink({ href: url }).run();
    setLinkUrl("");
    setShowLinkInput(false);
  }

  return (
    <div className="border border-zinc-700 rounded-xl overflow-hidden bg-zinc-900 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-zinc-700 bg-zinc-800/60">
        {/* Text style */}
        <ToolbarBtn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} title="Paragraph">
          <span className="font-sans text-xs font-medium px-0.5">P</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <span className="font-sans text-xs font-bold px-0.5">H2</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
          <span className="font-sans text-xs font-bold px-0.5">H3</span>
        </ToolbarBtn>

        <Divider />

        {/* Formatting */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 6C16 6 14 4 12 4C10 4 7 5 7 8C7 9.5 8 10.5 9.5 11"/><path d="M8 18C8 18 10 20 12 20C15 20 17 18.5 17 16C17 14.5 16 13.5 14 13"/></svg>
        </ToolbarBtn>

        <Divider />

        {/* Lists */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="8" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">1.</text><text x="2" y="14" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">2.</text><text x="2" y="20" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">3.</text></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg>
        </ToolbarBtn>

        <Divider />

        {/* Alignment */}
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        </ToolbarBtn>

        <Divider />

        {/* Link */}
        <ToolbarBtn
          onClick={() => {
            setShowImageInput(false);
            setShowLinkInput((v) => !v);
            setTimeout(() => linkInputRef.current?.focus(), 50);
          }}
          active={editor.isActive("link") || showLinkInput}
          title="Insert Link"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </ToolbarBtn>

        {/* Image */}
        <ToolbarBtn
          onClick={() => {
            setShowLinkInput(false);
            setShowImageInput((v) => !v);
            setTimeout(() => imageInputRef.current?.focus(), 50);
          }}
          active={showImageInput}
          title="Insert Image"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </ToolbarBtn>

        <Divider />

        {/* Undo / Redo */}
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>
        </ToolbarBtn>

        {/* Clear formatting */}
        <ToolbarBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3l4 4-9.5 9.5L6 21l-3-3 9.5-9.5z"/><line x1="19" y1="19" x2="22" y2="22"/><line x1="3" y1="3" x2="5" y2="5" strokeLinecap="round"/></svg>
        </ToolbarBtn>
      </div>

      {/* Inline inputs for link / image */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-700 bg-zinc-800/40">
          <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <input
            ref={linkInputRef}
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertLink(); } if (e.key === "Escape") setShowLinkInput(false); }}
            placeholder="https://example.com"
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          />
          <button type="button" onClick={insertLink} className="text-xs bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/80 transition">Insert</button>
          <button type="button" onClick={() => setShowLinkInput(false)} className="text-xs text-zinc-500 hover:text-zinc-300 transition">✕</button>
        </div>
      )}

      {showImageInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-700 bg-zinc-800/40">
          <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <input
            ref={imageInputRef}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertImage(); } if (e.key === "Escape") setShowImageInput(false); }}
            placeholder="https://images.unsplash.com/photo-…"
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          />
          <button type="button" onClick={insertImage} className="text-xs bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/80 transition">Insert</button>
          <button type="button" onClick={() => setShowImageInput(false)} className="text-xs text-zinc-500 hover:text-zinc-300 transition">✕</button>
        </div>
      )}

      {/* Editor area */}
      <EditorContent editor={editor} />

      {/* Word count */}
      <div className="px-4 py-1.5 border-t border-zinc-800 bg-zinc-900/60 text-right">
        <span className="text-xs text-zinc-600">
          {editor.storage.characterCount?.words?.() ?? editor.getText().trim().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #52525b;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #3b82f6;
          padding-left: 1rem;
          color: #a1a1aa;
          font-style: italic;
          margin: 1rem 0;
        }
        .ProseMirror h2 { font-size: 1.4rem; font-weight: 700; margin: 1.2rem 0 0.5rem; color: #f4f4f5; }
        .ProseMirror h3 { font-size: 1.15rem; font-weight: 600; margin: 1rem 0 0.4rem; color: #f4f4f5; }
        .ProseMirror h4 { font-size: 1rem; font-weight: 600; margin: 0.8rem 0 0.3rem; color: #f4f4f5; }
        .ProseMirror ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror li { margin: 0.25rem 0; }
        .ProseMirror a { color: #3b82f6; text-decoration: underline; }
        .ProseMirror p { margin: 0.5rem 0; }
        .ProseMirror strong { font-weight: 700; }
        .ProseMirror em { font-style: italic; }
        .ProseMirror s { text-decoration: line-through; }
        .ProseMirror code { background: #27272a; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.85em; }
        .ProseMirror pre { background: #18181b; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 0.75rem 0; }
        .ProseMirror pre code { background: none; padding: 0; }
        .ProseMirror hr { border: none; border-top: 1px solid #3f3f46; margin: 1.5rem 0; }
      `}</style>
    </div>
  );
}
