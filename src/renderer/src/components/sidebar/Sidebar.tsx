import clsx from "clsx";
import { FC, useRef, useState } from "react";
import { ProjectImage } from "../ProjectImage";
import defaultBannerImage from "@renderer/assets/images/fantasy-endless-hole-landscape.jpg";
import { ReactNode } from "@tanstack/react-router";
import { useAtom, useAtomValue } from "jotai";
import {
  currentProjectIdAtom,
  Open,
  sidebarStateAtom,
} from "@renderer/routes/__root";
import { useProject } from "@renderer/hooks/project/useProject";
import { ProjectSwitcher } from "../ProjectSwitcher";
import { NavMain } from "../nav-main";
import { SidebarFiles } from "./SidebarFiles";
import { data } from "./sidebarData";
import { NavUser } from "../nav-user";
import { Separator } from "../ui/separator";
import { SidebarExtender } from "./SidebarExtender";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useCurrentDir } from "@renderer/hooks/useProjectDir";

export const Sidebar: FC<{ children: ReactNode }> = ({ children }) => {
  const [width, setWidth] = useState(320);
  const originalWidth = useRef(width);
  const originalClientX = useRef(width);
  const [isDragging, setDragging] = useState(false);

  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom);
  const currentProjectId = useAtomValue(currentProjectIdAtom);

  const { data: projectDir } = useCurrentDir();

  const { data: currentProject } = useProject(currentProjectId);

  const sidebarData = data(currentProject);

  return (
    <div className="flex h-full h-screen w-screen justify-start">
      <nav
        className={clsx(
          "fixed top-0 bottom-0 left-0 z-10 flex h-screen max-h-screen flex-shrink-0 grainy bg-sidebar flex-col space-y-2 transition-transform duration-300 ease-sidebar",
          {
            ["cursor-col-resize"]: isDragging,
          },
          isDragging
            ? "shadow-[rgba(0,0,0,0.2)_-2px_0px_0px_0px_inset]"
            : "shadow-[rgba(0,0,0,0.04)_-2px_0px_0px_0px_inset]",
          sidebarState === Open.Open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-labelledby="nav-heading"
        style={{ width }}
      >
        <div className="flex h-full flex-col overflow-auto pt-12">
          <section className="px-1.5 space-y-1">
            <ProjectImage image={defaultBannerImage} />
            <ProjectSwitcher currentProject={currentProject} />
          </section>
          <section className="flex-grow overflow-y-auto">
            <NavMain items={sidebarData.navMain} />
            <Separator
              orientation="horizontal"
              className="h-px bg-sidebar-accent/10"
            />
            <SidebarFiles project={currentProject} />
          </section>
          <section className="mt-auto">
            <NavUser
              user={{
                name: projectDir?.name || "",
                position: "Writer",
                avatar: "/avatars/shadcn.jpg",
              }}
            />
          </section>
        </div>

        <SidebarExtender
          width={width}
          setWidth={setWidth}
          originalWidth={originalWidth}
          originalClientX={originalClientX}
          setDragging={setDragging}
          setState={setSidebarState}
        />
      </nav>
      <main
        style={{ paddingLeft: sidebarState === Open.Open ? width + 1 : 8 }}
        className={clsx(
          "flex max-h-screen w-full flex-grow p-2 bg-sidebar grainy z-2",
          isDragging
            ? "transition-none"
            : "transition-all duration-300 ease-sidebar",
        )}
      >
        <div className="flex flex-grow grow flex-col ring-border/50 ring overflow-auto bg-background shadow-sm rounded-lg">
          {children}
        </div>
      </main>
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom"
        buttonPosition="bottom-left"
      />
    </div>
  );
};
