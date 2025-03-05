import { Plate } from '@udecode/plate/react'

import { useCreateEditor } from '@renderer/components/editor/use-create-editor'
import { Editor, EditorContainer } from '@renderer/components/plate-ui/editor'
import { FC } from 'react'

export const BasicEditor: FC<{
  editor: ReturnType<typeof useCreateEditor>
  setContent: (content: any) => void
  editorClassName?: string
  className?: string
  placeholder?: string
}> = ({
  editor,
  setContent,
  editorClassName = 'text-brand',
  className,
  placeholder = 'Enter text or type / for commands...'
}) => {
  return (
    <Plate editor={editor} onChange={({ value }) => setContent(value)}>
      <EditorContainer className={className}>
        <Editor placeholder={placeholder} className={editorClassName} variant="basic" />
      </EditorContainer>
    </Plate>
  )
}
