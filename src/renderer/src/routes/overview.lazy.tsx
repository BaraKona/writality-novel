import { ProjectCard } from "@renderer/components/project/ProjectCard";
import { Button } from "@renderer/components/ui/button";
import { useAllProjects } from "@renderer/hooks/project/useAllProjects";
import { useCreateProject } from "@renderer/hooks/project/useCreateProject";
import { useCurrentDir } from "@renderer/hooks/useProjectDir";
import { greetingTime } from "@renderer/lib/utils";
import { createLazyFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { currentProjectIdAtom } from "./__root";
import { useAtom } from "jotai";

export const Route = createLazyFileRoute("/overview")({
  component: RouteComponent,
});

const today = new Date();
const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);
const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

function RouteComponent(): JSX.Element {
  const { data: projects, isLoading } = useAllProjects();
  const { data } = useCurrentDir();
  const { mutate: createProject } = useCreateProject();
  const [currentProjectId, setCurrentProjectId] = useAtom(currentProjectIdAtom);

  console.log({ currentProjectId });
  const updatedToday: typeof projects = [];
  const updatedThisWeek: typeof projects = [];
  const updatedThisMonth: typeof projects = [];
  const updatedAllTime: typeof projects = [];

  projects?.map((project) => {
    const updatedAt = new Date(project?.updated_at || 0);
    if (updatedAt >= oneDayAgo) {
      updatedToday.push(project);
    } else if (updatedAt >= oneWeekAgo) {
      updatedThisWeek.push(project);
    } else if (updatedAt >= oneMonthAgo) {
      updatedThisMonth.push(project);
    } else if (updatedAt >= oneYearAgo) {
      updatedAllTime.push(project);
    }
  });

  const updatedProjects = [
    { name: "Updated Today", projects: updatedToday },
    { name: "Updated This Week", projects: updatedThisWeek },
    { name: "Updated This Month", projects: updatedThisMonth },
    { name: "Updated All Time", projects: updatedAllTime },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex h-full flex-col">
      <div className="flex w-full gap-2 border-y p-2 py-1">
        <div className="rounded-md bg-accent p-1 px-2 text-xs font-medium">
          Stories
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto flex items-center gap-2 rounded-md p-1 px-2 text-xs font-medium"
          onClick={createProject}
        >
          <PlusIcon size={16} className="" strokeWidth={2.5} />
          New Story
        </Button>
      </div>
      <div className="grow overflow-y-auto p-4">
        <div className="mx-auto h-full w-full max-w-(--breakpoint-sm) space-y-8 lg:max-w-(--breakpoint-lg)">
          <h1 className="py-5 text-center font-serif-thick text-6xl leading-tight tracking-wide  text-foreground">
            {greetingTime()},{" "}
            <span className="capitalize text-muted-foreground">
              {data?.name || "Stranger"}!
            </span>
          </h1>

          {updatedProjects.map((category, index) => (
            <div key={index}>
              {category.projects && category.projects.length > 0 && (
                <div className="relative mb-3 flex items-center gap-3">
                  <h2 className="shrink-0 text-sm font-medium">
                    {category.name}
                  </h2>
                  <div className="h-px w-full bg-border" />
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {category.projects?.map((project, index) => (
                  <ProjectCard
                    project={project}
                    onClick={() => setCurrentProjectId(project.id)}
                    key={index}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
