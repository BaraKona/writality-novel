import { Emoji } from '@shared/models'
import { FolderOpen } from 'lucide-react'
import { FolderIcon, FolderOpenIcon, type LucideIcon } from 'lucide-react'

export const EmojiDisplay = ({
  emoji,
  file = true,
  className,
  type = 'file',
  folderOpen = false
}: {
  emoji: Emoji
  file?: boolean
  className?: string
  type?: 'file' | 'folder' | 'project'
  folderOpen?: boolean
}) => {
  if (type === 'folder') {
    return (
      <div className={className}>
        {emoji?.src ? (
          <img src={emoji?.src} alt="emoji" className={`${file ? 'w-4 h-4' : 'w-28 h-28'}`} />
        ) : (
          <span className={`${file ? 'text-lg' : ''}`}>
            {emoji?.native || (folderOpen ? <FolderOpen size={16} /> : <FolderIcon size={16} />)}
          </span>
        )}
      </div>
    )
  }

  if (type === 'project') {
    return (
      <div className={className}>
        {emoji?.src ? (
          <img src={emoji?.src} alt="emoji" className={'w-5 h-5'} />
        ) : (
          <span className={`${file ? 'text-xl' : ''}`}>{emoji?.native || '📖'}</span>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      {emoji?.src ? (
        <img src={emoji?.src} alt="emoji" className={`${file ? 'w-4 h-4' : 'w-28 h-28'}`} />
      ) : (
        <span className={`${file ? 'text-lg' : ''}`}>{emoji?.native || '📖'}</span>
      )}
    </div>
  )
}
