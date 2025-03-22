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
  Strikethrough,
} from "lucide-react";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import type { Editor } from "@tiptap/core";
import type { Selection } from "@tiptap/pm/state";
import type { FC } from "react";

interface SelectionMenuProps {
  editor: Editor;
  view: EditorView;
  from: number;
  to: number;
}

interface ButtonProps {
  icon: FC<{ className?: string }>;
  action: () => boolean;
}

const SelectionMenu = ({
  editor,
  view,
  from,
  to,
}: SelectionMenuProps): HTMLDivElement => {
  const start = view.coordsAtPos(from);
  const end = view.coordsAtPos(to);

  const left = Math.min(start.left, end.left);
  const top = Math.min(start.top, end.top) - 40; // Position above the selection

  const menu = document.createElement("div");
  menu.className = "floating-menu";
  menu.style.position = "absolute";
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;

  const buttons: ButtonProps[] = [
    {
      icon: Bold,
      action: (): boolean => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      action: (): boolean => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: Underline,
      action: (): boolean => editor.chain().focus().toggleUnderline().run(),
    },
    {
      icon: Strikethrough,
      action: (): boolean => editor.chain().focus().toggleStrike().run(),
    },
    {
      icon: Link,
      action: (): boolean => {
        const url = window.prompt("Enter URL");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
        return true;
      },
    },
    {
      icon: List,
      action: (): boolean => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      action: (): boolean => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: AlignLeft,
      action: (): boolean => editor.chain().focus().setTextAlign("left").run(),
    },
    {
      icon: AlignCenter,
      action: (): boolean =>
        editor.chain().focus().setTextAlign("center").run(),
    },
    {
      icon: AlignRight,
      action: (): boolean => editor.chain().focus().setTextAlign("right").run(),
    },
    {
      icon: Heading1,
      action: (): boolean =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2,
      action: (): boolean =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: Heading3,
      action: (): boolean =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      icon: Code,
      action: (): boolean => editor.chain().focus().toggleCode().run(),
    },
    {
      icon: Quote,
      action: (): boolean => editor.chain().focus().toggleBlockquote().run(),
    },
  ];

  buttons.forEach(({ icon: Icon, action }) => {
    const button = document.createElement("button");
    button.className = "toolbar-button";
    const iconElement = Icon({});
    if (
      iconElement &&
      "props" in iconElement &&
      "children" in iconElement.props
    ) {
      button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconElement.props.children}</svg>`;
    }
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

  addProseMirrorPlugins(): Plugin[] {
    let menu: HTMLElement | null = null;

    return [
      new Plugin({
        key: new PluginKey("selectionMenu"),
        view: (): {
          update: (
            view: EditorView,
            prevState: { selection: Selection },
          ) => void;
          destroy: () => void;
        } => {
          return {
            update: (
              view: EditorView,
              prevState: { selection: Selection },
            ): void => {
              const { from, to } = view.state.selection;
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
            destroy: (): void => {
              if (menu) {
                menu.remove();
                menu = null;
              }
            },
          };
        },
        props: {
          handleClick: (): boolean => {
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
