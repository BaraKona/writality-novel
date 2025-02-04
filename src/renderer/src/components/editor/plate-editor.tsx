

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate/react';

import { useCreateEditor } from '@renderer/components/editor/use-create-editor';
import { SettingsDialog } from '@renderer/components/editor/settings';
import { Editor, EditorContainer } from '@renderer/components/plate-ui/editor';

export function PlateEditor() {
  const editor = useCreateEditor();

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <EditorContainer>
          <Editor variant="default" />
        </EditorContainer>
        <SettingsDialog />
      </Plate>
    </DndProvider>
  );
}
