import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Node } from "@tiptap/pm/model";
import { EditorView } from "@tiptap/pm/view";

export const Draggable = Extension.create({
  name: "draggable",

  addProseMirrorPlugins(): Plugin[] {
    let dragHandleElement: HTMLElement | null = null;
    let draggedNode: Node | null = null;
    let draggedPos: number | null = null;

    const plugin = new Plugin({
      key: new PluginKey("draggable"),
      props: {
        decorations: (state): DecorationSet => {
          const { doc } = state;
          const decorations: Decoration[] = [];

          doc.descendants((node, pos) => {
            // Only add drag handles to block nodes
            if (node.isBlock && !node.isText) {
              const dom = document.createElement("div");
              dom.className = "drag-handle";
              dom.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>`;

              dom.addEventListener("mousedown", (e) => {
                e.preventDefault();
                dragHandleElement = dom;
                draggedNode = node;
                draggedPos = pos;
              });

              decorations.push(
                Decoration.widget(pos, dom, {
                  side: -1,
                  key: `drag-handle-${pos}`,
                }),
              );
            }
          });

          return DecorationSet.create(doc, decorations);
        },
      },
      propsView: {
        update: (view: EditorView, oldState): void => {
          const old = oldState.decorations;
          const now = view.state.decorations;

          if (old.eq(now)) return;

          view.dom.classList.remove("dragging");
          if (dragHandleElement) {
            dragHandleElement.classList.remove("dragging");
          }

          if (draggedNode && draggedPos !== null) {
            const { state, dispatch } = view;
            const { tr } = state;

            // Find the current position of the dragged node
            let currentPos = draggedPos;
            state.doc.nodesBetween(0, state.doc.content.size, (node, pos) => {
              if (node === draggedNode) {
                currentPos = pos;
              }
            });

            // If the position has changed, move the node
            if (currentPos !== draggedPos) {
              tr.delete(draggedPos, draggedPos + draggedNode.nodeSize);
              tr.insert(currentPos, draggedNode);
              dispatch(tr);
            }
          }

          dragHandleElement = null;
          draggedNode = null;
          draggedPos = null;
        },
      },
      propsHandleDOMEvents: {
        mousemove: (view: EditorView, event: MouseEvent): boolean => {
          if (!dragHandleElement || !draggedNode || draggedPos === null) {
            return false;
          }

          event.preventDefault();
          view.dom.classList.add("dragging");
          dragHandleElement.classList.add("dragging");

          const { state } = view;

          // Calculate the current position
          const pos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (pos && typeof pos === "number") {
            const $pos = state.doc.resolve(pos);
            const targetPos = $pos.before($pos.depth);

            // Only allow dropping at valid positions
            if (
              targetPos !== draggedPos &&
              targetPos >= 0 &&
              targetPos <= state.doc.content.size
            ) {
              draggedPos = targetPos;
            }
          }

          return true;
        },
        mouseup: (view: EditorView): boolean => {
          if (!dragHandleElement || !draggedNode || draggedPos === null) {
            return false;
          }

          view.dom.classList.remove("dragging");
          dragHandleElement.classList.remove("dragging");
          dragHandleElement = null;
          draggedNode = null;
          draggedPos = null;

          return true;
        },
      },
    });

    return [plugin];
  },
});
