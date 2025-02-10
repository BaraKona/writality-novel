import { FC } from 'react'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { BlockNoteSchema, locales } from '@blocknote/core'
import { useCreateBlockNote } from '@blocknote/react'
import {
  multiColumnDropCursor,
  locales as multiColumnLocales,
  withMultiColumn
} from '@blocknote/xl-multi-column'

export const SmallEditor: FC<{ content: string; editable?: boolean }> = ({
  content,
  editable = false
}) => {
  const editor = useCreateBlockNote(
    {
      // Adds column and column list blocks to the schema.
      schema: withMultiColumn(BlockNoteSchema.create()),
      // The default drop cursor only shows up above and below blocks - we replace
      // it with the multi-column one that also shows up on the sides of blocks.
      dropCursor: multiColumnDropCursor,
      // Merges the default dictionary with the multi-column dictionary.
      dictionary: {
        ...locales.en,
        multi_column: multiColumnLocales.en
      },
      initialContent: content
    },
    [content]
  )

  return (
    <BlockNoteView
      editor={editor}
      className="-mx-10 h-full !text-xs pointer-events-none"
      data-color-scheme="theme-light"
      editable={editable}
      style={{ fontSize: '0.25rem' }}
    />
  )
}
