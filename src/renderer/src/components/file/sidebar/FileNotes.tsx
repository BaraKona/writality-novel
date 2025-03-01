import { FC, useState } from 'react'

import { useLocation } from '@tanstack/react-router'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { SmallEditor } from '@renderer/components/editor/SmallEditor'

export const FileNotes: FC<{ file?: any }> = ({ file }) => {
  const [addingNote, setAddingNote] = useState(false)
  const [animate] = useAutoAnimate()

  return (
    <div className="flex w-full flex-col px-2">
      <div className="flex items-center gap-2 rounded-lg bg-background p-2 px-4 text-sm ring ring-border">
        <SmallEditor
          content={''}
          editable={true}
          className="overflow-hidden !text-accent-foreground"
          onChange={() => {}}
          theme={{
            fontFamily: 'font-serif-thick'
          }}
        />
      </div>
    </div>
  )
}
