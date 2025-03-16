import { atomWithStorage } from "jotai/utils";
import { createRootRoute, Outlet, ReactNode } from "@tanstack/react-router";
import { ProjectDirectory } from "@shared/models";
import { Header } from "@renderer/components/Header";
import { Sidebar } from "@renderer/components/sidebar/Sidebar";
import { Toaster } from "@renderer/components/ui/toaster";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Writality",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent(): JSX.Element {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

export const Open = {
  Open: "open",
  Closed: "closed",
} as const;

export type TOpen = (typeof Open)[keyof typeof Open];

export const sidebarStateAtom = atomWithStorage<TOpen>(
  "primarySidebarState",
  Open.Open,
);
export const projectDirAtom = atomWithStorage<ProjectDirectory | null>(
  "projectDir",
  null,
);

export const currentProjectIdAtom = atomWithStorage<number | null>(
  "currentProjectId",
  null,
);

function RootDocument({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <Sidebar>
      <Header />
      <div className="flex h-full grow flex-col overflow-y-auto">
        {children}
      </div>
      <Toaster />
    </Sidebar>
  );
}
