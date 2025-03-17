import { useChapter } from "@renderer/hooks/chapter/useChapter";
import { useDebounce } from "@renderer/hooks/useDebounce";
import { createFileRoute } from "@tanstack/react-router";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useUpdateChapter } from "@renderer/hooks/chapter/useUpdateChapter";
import { useCreateVersion } from "@renderer/hooks/chapter/version/useCreateVersion";
import { Infobar } from "@renderer/components/chapter/InfoBar";
import { FileSidebar } from "@renderer/components/file/FileSidebar";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { useRef, useState, useCallback } from "react";
import { atomWithStorage } from "jotai/utils";
import { Open, TOpen } from "../__root";
import clsx from "clsx";
import { useAtom } from "jotai";
import { SidebarExtender } from "@renderer/components/sidebar/SidebarExtender";
import { getWordCountFromRichContent } from "@renderer/lib/utils";
import { chaptersTable } from "../../../../db/schema";

export const Route = createFileRoute("/chapters/$chapterId")({
  component: RouteComponent,
});

export type ChapterSidebarState = {
  state: TOpen;
  category: string;
};

const chapterSidebarStateAtom = atomWithStorage<ChapterSidebarState>(
  "ChapterSidebarState",
  {
    state: Open.Closed,
    category: "note",
  },
);

function RouteComponent(): JSX.Element {
  const [width, setWidth] = useState(400);
  const originalWidth = useRef(width);
  const originalClientX = useRef(width);
  const [isDragging, setDragging] = useState(false);
  const { chapterId } = Route.useParams();
  const { data: chapter } = useChapter(Number(chapterId));
  const editor = useCreateEditor({ value: chapter?.description });

  const [content, setContent] = useState(chapter?.description);
  const [lastSavedContent, setLastSavedContent] = useState(
    chapter?.description,
  );
  const { mutate: updateChapter } = useUpdateChapter(
    chapter?.parent || undefined,
  );
  const { mutate: createVersion } = useCreateVersion();
  const [sidebarState, setSidebarState] = useAtom(chapterSidebarStateAtom);

  type EditorContent = { text?: string; children?: EditorContent[] }[];

  const handleContentUpdate = useCallback(
    (value: EditorContent) => {
      if (!chapter) return;

      console.log("triggered  ");

      // Only update if content has actually changed
      if (JSON.stringify(value) !== JSON.stringify(lastSavedContent)) {
        const updatedChapter = {
          ...chapter,
          description: value,
          word_count: getWordCountFromRichContent(value),
        } satisfies typeof chaptersTable.$inferInsert;

        // Update chapter
        updateChapter(updatedChapter);

        // Create version
        createVersion({
          chapterId: chapter.id,
          description: value,
        });

        setLastSavedContent(value);
      }
    },
    [chapter, createVersion, lastSavedContent, updateChapter],
  );

  const debouncedUpdate = useDebounce(handleContentUpdate, 2000);

  return (
    <div className="flex grow overflow-y-auto relative" key={chapterId}>
      <div
        className={clsx(
          "fixed top-0 bottom-0 z-[100] flex h-full pt-11.25 pb-4 pointer-events-none bg-transparent max-h-screen flex-shrink-0 flex-col space-y-2 transition-transform duration-300 ease-sidebar",
          {
            ["cursor-col-resize"]: isDragging,
          },
          isDragging
            ? "shadow-[rgba(0,0,0,0.2)_-2px_0px_0px_0px_inset]"
            : "shadow-[rgba(0,0,0,0.04)_-2px_0px_0px_0px_inset]",
          sidebarState.state === Open.Open
            ? "-translate-x-0 right-0"
            : "translate-x-full right-0",
        )}
        aria-labelledby="nav-heading"
        style={{ width }}
        key={chapterId}
      >
        <SidebarExtender
          width={width}
          setWidth={setWidth}
          originalWidth={originalWidth}
          originalClientX={originalClientX}
          setDragging={setDragging}
          setState={setSidebarState}
          dragPosition="left"
          className="h-[91%] mt-10"
        />
        <FileSidebar
          setSidebarState={setSidebarState}
          sidebarState={sidebarState}
          file={chapter!}
        />
      </div>
      <div
        key="file-content"
        style={{
          paddingRight: sidebarState.state === Open.Open ? width - 8 : 0,
        }}
        className={clsx(
          "flex max-h-screen w-full flex-grow flex-col",
          isDragging
            ? "transition-none"
            : "transition-all duration-300 ease-sidebar",
        )}
      >
        <Infobar
          chapter={chapter!}
          updatedContent={content || ""}
          setSidebarState={setSidebarState}
          sidebarState={sidebarState}
          // onSaveMajorVersion={() => {
          //   if (chapter && content) {
          //     createVersion({
          //       chapterId: chapter.id,
          //       description: content,
          //       isMajorVersion: true,
          //     });
          //   }
          // }}
        />
        <div
          className="relative flex h-full w-full flex-col overflow-y-auto px-16"
          key={chapterId}
        >
          <div className="mx-auto w-full max-w-screen-md px-2 pt-14">
            <h1
              className="text-editorText mt-4 min-h-fit font-serif-thick text-4xl font-semibold ring-0 outline-none"
              contentEditable={true}
              // onBlur={(e) => {
              //   if (!chapter) return;
              //   const newName = e.currentTarget.innerText.trim();
              //   if (newName !== chapter.name) {
              //     updateChapter({
              //       ...chapter,
              //       name: newName,
              //     });
              //     // Create a version when chapter name changes
              //     createVersion({
              //       chapterId: chapter.id,
              //       description: chapter.description || "",
              //       isMajorVersion: true,
              //     });
              //   }
              // }}
              dangerouslySetInnerHTML={{
                __html: chapter?.name || "",
              }}
            />
            <BasicEditor
              editor={editor}
              setContent={(value) => {
                setContent(value);
                debouncedUpdate(value);
              }}
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
