import { FC, useState } from 'react'

import { useLocation } from '@tanstack/react-router'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { SmallEditor } from '@renderer/components/editor/SmallEditor'
import { BasicEditor } from '@renderer/components/editor/BasicEditor'
import { useCreateEditor } from '@renderer/components/editor/use-create-editor'
import { useDebounce } from '@renderer/hooks/useDebounce'

export const FileNotes: FC<{ file?: any }> = ({ file }) => {
  const editor = useCreateEditor({ value: [] })

  return (
    <div className="flex w-full flex-col px-2">
      <div className="flex items-center gap-2 rounded-lg bg-background p-2 px-4 text-sm ring ring-border">
        <BasicEditor
          editor={editor}
          setContent={(value) => console.log(value)}
          editorClassName="text-sm !text-red-400"
          placeholder="Start writing..."
        />
      </div>
    </div>
  )
}
