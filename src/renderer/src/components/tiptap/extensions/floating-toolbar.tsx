import { BubbleMenu, type Editor } from "@tiptap/react";
import { BoldToolbar } from "../toolbars/bold";
import { ItalicToolbar } from "../toolbars/italic";
import { UnderlineToolbar } from "../toolbars/underline";
import { LinkToolbar } from "../toolbars/link";
import { ColorHighlightToolbar } from "../toolbars/color-and-highlight";
import { ToolbarProvider } from "../toolbars/toolbar-provider";
import { TooltipProvider } from "@renderer/components/ui/tooltip";
import { useMediaQuery } from "@renderer/hooks/use-media-query";
import { ScrollArea, ScrollBar } from "@renderer/components/ui/scroll-area";
import { Separator } from "@renderer/components/ui/separator";
import { HeadingsToolbar } from "../toolbars/headings";
import { BulletListToolbar } from "../toolbars/bullet-list";
import { OrderedListToolbar } from "../toolbars/ordered-list";
import { ImagePlaceholderToolbar } from "../toolbars/image-placeholder-toolbar";
import { AlignmentTooolbar } from "../toolbars/alignment";
import { BlockquoteToolbar } from "../toolbars/blockquote";
import { useEffect } from "react";

export const FloatingToolbar = ({
  editor,
}: {
  editor: Editor | null;
}): JSX.Element | null => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Prevent default context menu on mobile
  useEffect(() => {
    if (!editor?.options.element || !isMobile) return;

    const handleContextMenu = (e: Event): void => {
      e.preventDefault();
    };

    const el = editor.options.element;
    el.addEventListener("contextmenu", handleContextMenu);

    return (): void => el.removeEventListener("contextmenu", handleContextMenu);
  }, [editor, isMobile]);

  if (!editor) return null;

  if (isMobile) {
    return (
      <TooltipProvider>
        <BubbleMenu
          tippyOptions={{
            duration: 100,
            placement: "bottom",
            offset: [0, 10],
          }}
          shouldShow={() => {
            // Show toolbar when editor is focused and has selection
            return editor.isEditable && editor.isFocused;
          }}
          editor={editor}
          className="w-full min-w-full mx-0 shadow-sm border rounded-sm bg-background"
        >
          <ToolbarProvider editor={editor}>
            <ScrollArea className="h-fit py-0.5 w-full">
              <div className="flex items-center px-2 gap-0.5">
                <div className="flex items-center gap-0.5 p-1">
                  {/* Primary formatting */}
                  <BoldToolbar />
                  <ItalicToolbar />
                  <UnderlineToolbar />
                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Structure controls */}
                  <HeadingsToolbar />
                  <BulletListToolbar />
                  <OrderedListToolbar />
                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Rich formatting */}
                  <ColorHighlightToolbar />
                  <LinkToolbar />
                  <ImagePlaceholderToolbar />
                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Additional controls */}
                  <AlignmentTooolbar />
                  <BlockquoteToolbar />
                </div>
              </div>
              <ScrollBar className="h-0.5" orientation="horizontal" />
            </ScrollArea>
          </ToolbarProvider>
        </BubbleMenu>
      </TooltipProvider>
    );
  }

  return null;
};
