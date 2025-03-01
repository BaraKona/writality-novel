import { FC } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useFileVersions } from '@/hooks/useFileVersions'
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
            className="flex bg-border h-6 rounded-md items-center gap-2 py-1 px-2 text-xs text-secondaryText"
          />
        ))}
      </div>
    )
  }
  return (
    <div className="h-full flex flex-col gap-0.5 grow px-2">
      {versions?.length === 0 || !versions ? (
        <div className="w-full flex flex-col gap-0.5 items-center text-text">
          <div className="flex items-center mt-8 gap-2 text-sm">
            <FileStackIcon size={18} />
            No versions yet.
          </div>
          <p className="text-xs mt-2 max-w-[250px] text-center mx-auto">
            Versions are created automatically when you save your file. By default, we create a new
            version every 200 words you add or delete
          </p>
        </div>
      ) : (
        versions.map((version, index) => (
          <div
            key={index}
            className="flex items-center gap-2 py-1 px-2 text-[0.8rem] rounded-md cursor-default hover:bg-hover"
            onClick={() => navigate({ search: { ...location.search, version: version.name } })}
          >
            <div className=" flex gap-1 items-center">
              <IconFileDescription size={16} />
              {version.name}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
