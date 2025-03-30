import { createLazyFileRoute } from "@tanstack/react-router";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";
import { useCharactersWithFractalRelationships } from "@renderer/hooks/character/useCharacters";
import { CharacterGraph } from "@renderer/components/visualization/CharacterGraph";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { Open, type TOpen } from "../__root";
import clsx from "clsx";
import { SidebarExtender } from "@renderer/components/sidebar/SidebarExtender";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useRef, useState } from "react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Button } from "@renderer/components/ui/button";
import { ChevronsLeft, ChevronsRight, Menu } from "lucide-react";

export const Route = createLazyFileRoute("/people/")({
  component: RouteComponent,
});

const peopleSidebarStateAtom = atomWithStorage<TOpen>(
  "peopleSidebarState",
  Open.Open,
);

function RouteComponent(): JSX.Element {
  const { data: characters, isLoading } =
    useCharactersWithFractalRelationships(11);
  const [width, setWidth] = useState(400);
  const originalWidth = useRef(width);
  const originalClientX = useRef(width);
  const [isDragging, setDragging] = useState(false);
  const [sidebarState, setSidebarState] = useAtom(peopleSidebarStateAtom);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex grow overflow-y-auto relative">
      <div
        className={clsx(
          "fixed top-0 bottom-0 z-[100] flex h-full pt-10.25 pb-4 pointer-events-none bg-transparent max-h-screen flex-shrink-0 flex-col space-y-2 transition-transform duration-300 ease-sidebar",
          {
            ["cursor-col-resize"]: isDragging,
          },
          isDragging
            ? "shadow-[rgba(0,0,0,0.2)_-2px_0px_0px_0px_inset]"
            : "shadow-[rgba(0,0,0,0.04)_-2px_0px_0px_0px_inset]",
          sidebarState === Open.Open
            ? "-translate-x-0 right-0"
            : "translate-x-full right-0",
        )}
        aria-labelledby="nav-heading"
        style={{ width }}
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
        <div className="border h-full rounded-l-xl bg-[#e0e3d3]">
          <div className="border-b border-border px-3 py-1">Sidebar</div>
        </div>
      </div>
      <div
        key="file-content"
        style={{
          paddingRight: sidebarState === Open.Open ? width - 8 : 0,
        }}
        className={clsx(
          "flex max-h-screen w-full flex-grow flex-col",
          isDragging
            ? "transition-none"
            : "transition-all duration-300 ease-sidebar",
        )}
      >
        <BreadcrumbNav
          items={[
            {
              title: "People",
              isCurrentPage: true,
            },
          ]}
          dropdownItems={[
            {
              title: "Characters",
              href: "/people/characters",
            },
          ]}
          actions={
            <Button
              variant="invisible"
              size="icon"
              className="flex group items-center gap-2 rounded-md p-1 px-2 text-xs font-medium"
              onClick={() =>
                setSidebarState((state) =>
                  state === Open.Open ? Open.Closed : Open.Open,
                )
              }
            >
              {sidebarState === Open.Open ? (
                <>
                  <Menu
                    size={16}
                    strokeWidth={1.5}
                    className="text-foreground block group-hover:hidden"
                  />
                  <ChevronsRight
                    size={16}
                    strokeWidth={1.5}
                    className="text-foreground hidden group-hover:block"
                  />
                </>
              ) : (
                <>
                  <Menu
                    size={16}
                    strokeWidth={1.5}
                    className="text-foreground block group-hover:hidden"
                  />
                  <ChevronsLeft
                    size={16}
                    strokeWidth={1.5}
                    className="text-foreground hidden group-hover:block"
                  />
                </>
              )}
            </Button>
          }
        />
        <div className="h-full overflow-y-auto p-2">
          {characters && <CharacterGraph data={characters} />}
        </div>
      </div>
    </div>
  );
}
