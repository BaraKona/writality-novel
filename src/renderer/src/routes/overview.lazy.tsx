import { ProjectCard } from '@renderer/components/project/ProjectCard'
import { Button } from '@renderer/components/ui/button'
import { useAllProjects } from '@renderer/hooks/project/useAllProjects'
import { useCreateProject } from '@renderer/hooks/project/useCreateProject'
import { useSetProjectDir } from '@renderer/hooks/useSetProjectDir'
import { greetingTime } from '@renderer/lib/utils'
import { appDirectoryName } from '@shared/constants'
import { createLazyFileRoute } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

export const Route = createLazyFileRoute('/overview')({
  component: RouteComponent,
})

const today = new Date()
const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000)
const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)

function RouteComponent() {
  const { data: projects, isLoading } = useAllProjects()
  const { mutate: createProject} = useCreateProject()
  const { mutate: switchProject } = useSetProjectDir()
  
  const updatedToday: File[] = []
  const updatedThisWeek: File[] = []
  const updatedThisMonth: File[] = []
  const updatedAllTime: File[] = []

  projects?.forEach((project) => {
    const updatedAt = new Date(project?.updated_at || 0)
    if (updatedAt >= oneDayAgo) {
      updatedToday.push(project)
    } else if (updatedAt >= oneWeekAgo) {
      updatedThisWeek.push(project)
    } else if (updatedAt >= oneMonthAgo) {
      updatedThisMonth.push(project)
    } else if (updatedAt >= oneYearAgo) {
      updatedAllTime.push(project)
    }
  })

  const updatedProjects = [
    { name: 'Updated Today', projects: updatedToday },
    { name: 'Updated This Week', projects: updatedThisWeek },
    { name: 'Updated This Month', projects: updatedThisMonth },
    { name: 'Updated All Time', projects: updatedAllTime }
  ]
  
  return (
      <section className="flex flex-col h-full overflow-y-auto">
      <div className="w-full border-y p-2 py-1 flex gap-2">
        <div className="rounded-md bg-accent p-1 px-2 text-xs font-medium">Stories</div>
        <Button
          variant='ghost'
          size='sm'
          className="rounded-md p-1 px-2 text-xs font-medium ml-auto flex items-center gap-2"
          onClick={() => createProject()}
        >
          <PlusIcon size={16} className="" strokeWidth={2.5} />
          New Story
        </Button>
      </div>
      <div className="p-4 overflow-y-auto grow">
        <div className="max-w-screen-sm lg:max-w-screen-lg mx-auto h-full w-full space-y-8">
          <h1 className="text-2xl font-semibold text-center py-5">
            {greetingTime()}, welcome to {appDirectoryName}
          </h1>

          {updatedProjects.map((category, index) => (
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
                    onClick={() => switchProject(project.id)}
                    key={index}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
