import type { Editor } from "@tiptap/react";
import React from "react";

export interface ToolbarContextProps {
  editor: Editor;
}

export const ToolbarContext = React.createContext<ToolbarContextProps | null>(
  null,
);

interface ToolbarProviderProps {
  editor: Editor;
  children: React.ReactNode;
}

export const ToolbarProvider = ({
  editor,
  children,
}: ToolbarProviderProps): JSX.Element => {
  return (
    <ToolbarContext.Provider value={{ editor }}>
      {children}
    </ToolbarContext.Provider>
  );
};

export const useToolbar = (): ToolbarContextProps => {
  const context = React.useContext(ToolbarContext);

  if (!context) {
    throw new Error("useToolbar must be used within a ToolbarProvider");
  }

  return context;
};
