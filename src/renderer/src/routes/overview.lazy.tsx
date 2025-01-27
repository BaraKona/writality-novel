import { useAllProjects } from '@renderer/hooks/project/useAllProjects'
import { useCreateProject } from '@renderer/hooks/project/useCreateProject'
import { greetingTime } from '@renderer/lib/utils'
import { appDirectoryName } from '@shared/constants'
import { createLazyFileRoute } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

export const Route = createLazyFileRoute('/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = useAllProjects()
  const {mutate: createProject} = useCreateProject()

  console.log({ data, isLoading })
  return (
      <section className="flex flex-col h-full overflow-y-auto">
      <div className="w-full border-y p-2 py-1 flex gap-2">
        <div className="rounded-md bg-hover p-1 px-2 text-xs font-medium text-text">Stories</div>
        <button
          className="bg-accent rounded-md p-1 px-2 text-xs font-medium ml-auto flex items-center gap-2"
          onClick={() => createProject()}
        >
          <PlusIcon size={16} className="" strokeWidth={2.5} />
          New Story
        </button>
      </div>
      <div className="p-4 overflow-y-auto grow">
        <div className="max-w-screen-sm lg:max-w-screen-lg mx-auto h-full w-full space-y-8">
          <h1 className="text-2xl font-semibold text-center py-5">
            {greetingTime()}, welcome to {appDirectoryName}
          </h1>
          { data?.map((project, index) => (
            <div key={index}>
              <div className="flex items-center gap-3 relative mb-3">
                <h2 className="text-sm font-medium shrink-0">{project.name}</h2>
                <div className=" w-full h-px bg-border" />
              </div>
              </div>

          ))}
          {/* {updatedProjects.map((category, index) => (
            <div key={index}>
              {category.projects && category.projects.length > 0 && (
                <div className="flex items-center gap-3 relative mb-3">
                  <h2 className="text-sm font-medium shrink-0">{category.name}</h2>
                  <div className=" w-full h-px bg-border" />
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {category.projects?.map((project, index) => (
                  <ProjectCard
                    project={project}
                    onClick={() => handleSwitchProject(project)}
                    key={index}
                  />
                ))}
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </section>
  )
}
