import { Plate } from "@udecode/plate/react";

import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { Editor, EditorContainer } from "@renderer/components/plate-ui/editor";
import { FC } from "react";
import { Value } from "@udecode/plate";

export const BasicEditor: FC<{
  editor: ReturnType<typeof useCreateEditor>;
  setContent: (content: Value) => void;
  editorClassName?: string;
  className?: string;
  placeholder?: string;
}> = ({
  editor,
  setContent,
  editorClassName = "text-brand",
  className,
  placeholder = "Enter text or type / for commands...",
}) => {
  return (
    <Plate editor={editor} onChange={({ value }) => setContent(value)}>
      <EditorContainer
        variant="default"
        className={className}
        id="scroll_container"
      >
        <Editor
          placeholder={placeholder}
          className={editorClassName}
          variant="basic"
        />
      </EditorContainer>
    </Plate>
  );
};
