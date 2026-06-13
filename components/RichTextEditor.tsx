"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type Props = {
  content: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-slate-300">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-bold transition ${
            editor.isActive("bold")
              ? "bg-blue-700 text-white"
              : "bg-white border hover:bg-blue-50"
          }`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm italic transition ${
            editor.isActive("italic")
              ? "bg-blue-700 text-white"
              : "bg-white border hover:bg-blue-50"
          }`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded text-sm transition ${
            editor.isActive("strike")
              ? "bg-blue-700 text-white"
              : "bg-white border hover:bg-blue-50"
          }`}
        >
          S̶
        </button>
        <div className="w-px bg-slate-300 mx-1" />
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-1 rounded text-sm font-bold transition ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-700 text-white"
              : "bg-white border hover:bg-blue-50"
          }`}
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1 rounded text-sm font-bold transition ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-700 text-white"
              : "bg-white border hover:bg-blue-50"
          }`}
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-3 py-1 rounded text-sm font-bold transition ${
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-700 text-white"
              : "bg-white border hover:bg-blue-50"
          }`}
        >
          H3
        </button>
        <div className="w-px bg-slate-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm transition ${
            editor.isActive("bulletList")
              ? "bg-blue-700 text-white"
              : "bg-white border hover:bg-blue-50"
          }`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm transition ${
            editor.isActive("orderedList")
              ? "bg-blue-700 text-white"
              : "bg-white border hover:bg-blue-50"
          }`}
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm transition ${
            editor.isActive("blockquote")
              ? "bg-blue-700 text-white"
              : "bg-white border hover:bg-blue-50"
          }`}
        >
          ❝ Quote
        </button>
        <div className="w-px bg-slate-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-3 py-1 rounded text-sm bg-white border hover:bg-blue-50 disabled:opacity-40"
        >
          ↩ Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-3 py-1 rounded text-sm bg-white border hover:bg-blue-50 disabled:opacity-40"
        >
          ↪ Redo
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
      />
    </div>
  );
}