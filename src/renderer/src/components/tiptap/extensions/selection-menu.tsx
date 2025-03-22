import {
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
} from "lucide-react";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import type { Editor } from "@tiptap/core";

interface SelectionMenuProps {
  editor: Editor;
  view: EditorView;
  from: number;
  to: number;
}

const SelectionMenu = ({ editor, view, from, to }: SelectionMenuProps) => {
  const start = view.coordsAtPos(from);
  const end = view.coordsAtPos(to);

  const left = Math.min(start.left, end.left);
  const top = Math.min(start.top, end.top) - 40; // Position above the selection

  const menu = document.createElement("div");
  menu.className = "floating-menu";
  menu.style.position = "absolute";
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;

  const buttons = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run() },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run() },
    {
      icon: Underline,
      action: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      icon: Link,
      action: () => editor.chain().focus().toggleLink({ href: "" }).run(),
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: AlignLeft,
      action: () => editor.chain().focus().setTextAlign("left").run(),
    },
    {
      icon: AlignCenter,
      action: () => editor.chain().focus().setTextAlign("center").run(),
    },
    {
      icon: AlignRight,
      action: () => editor.chain().focus().setTextAlign("right").run(),
    },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run() },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
  ];

  buttons.forEach(({ icon: Icon, action }) => {
    const button = document.createElement("button");
    button.className = "toolbar-button";
    button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${Icon({}).props.children}</svg>`;
    button.addEventListener("click", (e) => {
      e.preventDefault();
      action();
      view.focus();
    });
    menu.appendChild(button);
  });

  return menu;
};

export const SelectionMenuExtension = Extension.create({
  name: "selectionMenu",

  addProseMirrorPlugins() {
    let menu: HTMLElement | null = null;

    return [
      new Plugin({
        key: new PluginKey("selectionMenu"),
        view: (editorView) => {
          return {
            update: (view, prevState) => {
              const { state, from, to } = view;
              const { from: prevFrom, to: prevTo } = prevState.selection;

              // Only show menu when there's a text selection and not in a code block
              if (
                from !== to &&
                from !== prevFrom &&
                to !== prevTo &&
                !view.state.doc.resolve(from).parent.type.name.includes("code")
              ) {
                if (menu) {
                  menu.remove();
                }
                menu = SelectionMenu({
                  editor: this.editor,
                  view,
                  from,
                  to,
                });
                view.dom.parentElement?.appendChild(menu);
              } else if (menu) {
                menu.remove();
                menu = null;
              }
            },
            destroy: () => {
              if (menu) {
                menu.remove();
                menu = null;
              }
            },
          };
        },
        props: {
          handleClick: (view, pos, event) => {
            if (menu) {
              menu.remove();
              menu = null;
            }
            return false;
          },
        },
      }),
    ];
  },
});
