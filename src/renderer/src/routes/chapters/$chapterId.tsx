import { useChapter } from "@renderer/hooks/chapter/useChapter";
import { useDebounce } from "@renderer/hooks/useDebounce";
import { createFileRoute } from "@tanstack/react-router";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useUpdateChapter } from "@renderer/hooks/chapter/useUpdateChapter";
import { Infobar } from "@renderer/components/chapter/InfoBar";
import { FileSidebar } from "@renderer/components/file/FileSidebar";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { useRef, useState } from "react";
import { atomWithStorage } from "jotai/utils";
import { Open, TOpen } from "../__root";
import clsx from "clsx";
import { useAtom } from "jotai";
import { SidebarExtender } from "@renderer/components/sidebar/SidebarExtender";

export const Route = createFileRoute("/chapters/$chapterId")({
  component: RouteComponent,
});

export type ChapterSidebarState = {
  state: TOpen;
  category: String;
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
  const { mutate: updateChapter } = useUpdateChapter();
  const editor = useCreateEditor({ value: chapter?.description });

  const [sidebarState, setSidebarState] = useAtom(chapterSidebarStateAtom);

  const debouncedFunc = useDebounce(
    (value) => updateChapter({ ...chapter, description: value }),
    2000,
  );

  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  return (
    <div className="flex grow overflow-y-auto relative">
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
        />
      </div>
      <div
        key="file-content"
        style={{ paddingRight: sidebarState.state === Open.Open ? width : 0 }}
        className={clsx(
          "flex max-h-screen w-full flex-grow flex-col",
          isDragging
            ? "transition-none"
            : "transition-all duration-300 ease-sidebar",
        )}
      >
        <Infobar
          chapter={chapter}
          word={1000}
          setSidebarState={setSidebarState}
          sidebarState={sidebarState}
        />
        <div
          className="relative flex h-full w-full flex-col overflow-y-auto px-16"
          key={chapterId}
        >
          <div className="mx-auto w-full max-w-screen-lg px-2 pt-14">
            <h1
              className="text-editorText mt-4 min-h-fit font-serif-thick text-4xl font-semibold ring-0 outline-none"
              contentEditable={true}
              onBlur={(e) =>
                chapter &&
                updateChapter({
                  ...chapter,
                  name: e.currentTarget.innerText.trim(),
                })
              }
              dangerouslySetInnerHTML={{
                __html: chapter?.name || "",
              }}
            />
            <BasicEditor
              editor={editor}
              setContent={(value) => debouncedFunc(value)}
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
