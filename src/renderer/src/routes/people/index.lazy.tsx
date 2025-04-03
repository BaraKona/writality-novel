import { createLazyFileRoute } from "@tanstack/react-router";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";
import { CharacterGraph } from "@renderer/components/visualization/CharacterGraph";

import { Open, type TOpen } from "../__root";
import clsx from "clsx";
import { SidebarExtender } from "@renderer/components/sidebar/SidebarExtender";

import { useRef, useState, useCallback } from "react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Button } from "@renderer/components/ui/button";
import { ChevronsLeft, ChevronsRight, Menu } from "lucide-react";
import { CharacterSidebar } from "@renderer/components/people/CharacterSidebar";
import { useFractals } from "@renderer/hooks/fractal/useFractals";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";

export const Route = createLazyFileRoute("/people/")({
  component: RouteComponent,
});

const peopleSidebarStateAtom = atomWithStorage<TOpen>(
  "peopleSidebarState",
  Open.Open,
);

const selectedFractalIdAtom = atomWithStorage<number | null>(
  "selectedFractalId",
  null,
);

const selectedCharacterIdAtom = atomWithStorage<number | null>(
  "selectedCharacterId",
  null,
);

function RouteComponent(): JSX.Element {
  const [selectedFractalId, setSelectedFractalId] = useAtom(
    selectedFractalIdAtom,
  );
  const [width, setWidth] = useState(400);
  const originalWidth = useRef(width);
  const originalClientX = useRef(width);
  const [isDragging, setDragging] = useState(false);
  const [sidebarState, setSidebarState] = useAtom(peopleSidebarStateAtom);
  const [selectedCharacterId, setSelectedCharacterId] = useAtom(
    selectedCharacterIdAtom,
  );

  const { data: fractals } = useFractals();

  const onCharacterSelect = useCallback(
    (characterId: number): void => {
      setSelectedCharacterId(characterId);
    },
    [setSelectedCharacterId],
  );

  return (
    <div className="flex grow overflow-y-auto relative">
      <div
        className={clsx(
          "fixed top-0 bottom-0 flex h-full pt-10.25 pb-4  bg-transparent max-h-screen flex-shrink-0 flex-col space-y-2 transition-transform duration-300 ease-sidebar",
          {
            ["cursor-col-resize"]: isDragging,
          },
          isDragging
            ? "shadow-[rgba(0,0,0,0.2)_-2px_0px_0px_0px_inset]"
            : "shadow-[rgba(0,0,0,0.04)_-2px_0px_0px_0px_inset]",
          sidebarState === Open.Open || selectedCharacterId !== null
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
        <CharacterSidebar characterId={selectedCharacterId} />
      </div>
      <div
        key="file-content"
        style={{
          paddingRight:
            sidebarState === Open.Open || selectedCharacterId !== null
              ? width - 8
              : 0,
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
            <div className="flex items-center gap-2">
              <Select
                value={selectedFractalId?.toString()}
                onValueChange={(value) => setSelectedFractalId(Number(value))}
              >
                <SelectTrigger className="hover:bg-accent gap-2 border-none shadow-none h-5.5 text-sm">
                  <SelectValue placeholder="Select a fractal" />
                </SelectTrigger>
                <SelectContent>
                  {fractals?.length === 0 ? (
                    <div className="py-2 text-sm text-muted-foreground text-center">
                      No fractals available
                    </div>
                  ) : (
                    fractals?.map((fractal) => (
                      <SelectItem
                        key={fractal.id}
                        value={fractal.id.toString()}
                        onSelect={() => setSelectedFractalId(fractal.id)}
                      >
                        {fractal.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Button
                variant="invisible"
                size="icon"
                className="flex group items-center gap-2 rounded-md p-1 px-2 text-xs font-medium"
                onClick={() => {
                  setSidebarState((state) =>
                    state === Open.Open ? Open.Closed : Open.Open,
                  );
                  setSelectedCharacterId(null);
                }}
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
            </div>
          }
        />
        <div className="h-full overflow-y-auto p-2">
          <CharacterGraph
            selectedFractalId={selectedFractalId}
            onCharacterSelect={onCharacterSelect}
          />
        </div>
      </div>
    </div>
  );
}
