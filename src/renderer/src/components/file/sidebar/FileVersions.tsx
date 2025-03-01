import { FC } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useFileVersions } from '@renderer/hooks/useFileVersions'
import { IconFileDescription } from '@tabler/icons-react'
import { FileStackIcon } from 'lucide-react'

export const FileVersions: FC<{}> = ({}) => {
  const location = useLocation()
  const { data: versions, isLoading } = useFileVersions(location.pathname)
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-0.5 px-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="text-secondaryText flex h-6 items-center gap-2 rounded-md bg-border px-2 py-1 text-xs"
          />
        ))}
      </div>
    )
  }
  return (
    <div className="flex h-full grow flex-col gap-0.5 px-2">
      {versions?.length === 0 || !versions ? (
        <div className="flex w-full flex-col items-center gap-0.5 text-text">
          <div className="mt-8 flex items-center gap-2 text-sm">
            <FileStackIcon size={18} />
            No versions yet.
          </div>
          <p className="mx-auto mt-2 max-w-[250px] text-center text-xs">
            Versions are created automatically when you save your file. By default, we create a new
            version every 200 words you add or delete
          </p>
        </div>
      ) : (
        versions.map((version, index) => (
          <div
            key={index}
            className="hover:bg-hover flex cursor-default items-center gap-2 rounded-md px-2 py-1 text-[0.8rem]"
            onClick={() => navigate({ search: { ...location.search, version: version.name } })}
          >
            <div className="flex items-center gap-1">
              <IconFileDescription size={16} />
              {version.name}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
