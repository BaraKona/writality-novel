import React, { memo } from "react";

import { cn } from "@udecode/cn";
import { TElement, type Value, createSlatePlugin } from "@udecode/plate";
import { BoldPlugin, ItalicPlugin } from "@udecode/plate-basic-marks/react";
import { SoftBreakPlugin } from "@udecode/plate-break/react";
import {
  type DiffOperation,
  type DiffUpdate,
  computeDiff,
  withGetFragmentExcludeDiff,
} from "@udecode/plate-diff";
import {
  createPlatePlugin,
  toPlatePlugin,
  useSelected,
} from "@udecode/plate/react";

import {
  type PlateElementProps,
  type PlateLeafProps,
  type PlateProps,
  createPlateEditor,
  Plate,
  PlateContent,
  PlateElement,
  PlateLeaf,
} from "@udecode/plate/react";

import { cloneDeep } from "lodash";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { Button } from "@renderer/components/ui/button";

const InlinePlugin = createPlatePlugin({
  key: "inline",
  node: { isElement: true, isInline: true },
});

const InlineVoidPlugin = createPlatePlugin({
  key: "inline-void",
  node: { isElement: true, isInline: true, isVoid: true },
});

const diffOperationColors: Record<DiffOperation["type"], string> = {
  delete: "bg-red-100 text-red-800",
  insert: "bg-green-100 text-green-800",
  update: "bg-blue-100 text-blue-800",
};

const describeUpdate = ({ newProperties, properties }: DiffUpdate): string => {
  const addedProps: string[] = [];
  const removedProps: string[] = [];
  const updatedProps: string[] = [];

  Object.keys(newProperties).forEach((key) => {
    const oldValue = properties[key];
    const newValue = newProperties[key];

    if (oldValue === undefined) {
      addedProps.push(key);

      return;
    }
    if (newValue === undefined) {
      removedProps.push(key);

      return;
    }

    updatedProps.push(key);
  });

  const descriptionParts: string[] = [];

  if (addedProps.length > 0) {
    descriptionParts.push(`Added ${addedProps.join(", ")}`);
  }
  if (removedProps.length > 0) {
    descriptionParts.push(`Removed ${removedProps.join(", ")}`);
  }
  if (updatedProps.length > 0) {
    updatedProps.forEach((key) => {
      descriptionParts.push(
        `Updated ${key} from ${properties[key]} to ${newProperties[key]}`,
      );
    });
  }

  return descriptionParts.join("\n");
};

const InlineElement = memo(
  ({ children, ...props }: PlateElementProps): JSX.Element => {
    return (
      <PlateElement {...props} as="span" className="rounded-sm p-1">
        {children}
      </PlateElement>
    );
  },
);
InlineElement.displayName = "InlineElement";

const InlineVoidElement = memo(
  ({ children, ...props }: PlateElementProps): JSX.Element => {
    const selected = useSelected();

    return (
      <PlateElement {...props} as="span">
        <span
          className={cn(
            "rounded-sm bg-slate-200/50 p-1",
            selected && "bg-blue-500 text-white",
          )}
          contentEditable={false}
        >
          Inline void
        </span>
        {children}
      </PlateElement>
    );
  },
);
InlineVoidElement.displayName = "InlineVoidElement";

const DiffPlugin = toPlatePlugin(
  createSlatePlugin({
    key: "diff",
    node: { isLeaf: true },
  }).overrideEditor(withGetFragmentExcludeDiff),
  {
    render: {
      node: DiffLeaf,
      aboveNodes:
        () =>
        ({ children, editor, element }): JSX.Element | null => {
          if (!element.diff) return children;

          const diffOperation = element.diffOperation as DiffOperation;

          const label = (
            {
              delete: "deletion",
              insert: "insertion",
              update: "update",
            } as { [key: string]: string }
          )[diffOperation.type];

          const Component = editor.api.isInline(element) ? "span" : "div";

          return (
            <Component
              className={cn(
                diffOperationColors[diffOperation.type],
                "rounded-sm",
              )}
              title={
                diffOperation.type === "update"
                  ? describeUpdate(diffOperation)
                  : undefined
              }
              aria-label={label}
            >
              {children}
            </Component>
          );
        },
    },
  },
);

function DiffLeaf({ children, ...props }: PlateLeafProps): JSX.Element {
  const diffOperation = props.leaf.diffOperation as DiffOperation;

  const Component = (
    {
      delete: "del",
      insert: "ins",
      update: "span",
    } as { [key: string]: string }
  )[diffOperation.type];

  return (
    <PlateLeaf {...props} asChild>
      <Component
        key={Date.now()}
        className={cn(diffOperationColors[diffOperation.type], "rounded-sm")}
        title={
          diffOperation.type === "update"
            ? describeUpdate(diffOperation)
            : undefined
        }
      >
        {children}
      </Component>
    </PlateLeaf>
  );
}

const plugins = [
  InlinePlugin.withComponent(InlineElement),
  InlineVoidPlugin.withComponent(InlineVoidElement),
  BoldPlugin,
  ItalicPlugin,
  DiffPlugin,
  SoftBreakPlugin,
];

function VersionHistoryPlate(props: Omit<PlateProps, "children">): JSX.Element {
  return (
    <Plate {...props}>
      <PlateContent className="rounded-md border p-3" />
    </Plate>
  );
}

function Diff({
  current,
  previous,
}: {
  current: Value;
  previous: Value;
}): JSX.Element {
  const diffValue = React.useMemo(() => {
    const editor = createPlateEditor({
      plugins,
    });

    return computeDiff(previous, cloneDeep(current), {
      isInline: editor.api.isInline,
      lineBreakChar: "¶",
    }) as Value;
  }, [previous, current]);

  const editor = useCreateEditor(
    {
      plugins,
      value: diffValue,
    },
    [diffValue],
  );

  return <VersionHistoryPlate readOnly editor={editor} />;
}

export const VersionHistory = memo(
  ({
    version,
    chapterVersion,
  }: {
    version: TElement[];
    chapterVersion: TElement[];
  }): JSX.Element => {
    const editorRevision = useCreateEditor(
      {
        plugins,
        value: version,
      },
      [version],
    );

    return (
      <div className="flex flex-col gap-3 overflow-y-auto h-full">
        <div className="grid gap-3 md:grid-cols-2 overflow-y-auto h-full">
          <div>
            <h2>Version </h2>
            <VersionHistoryPlate readOnly editor={editorRevision} />
          </div>

          <div>
            <h2>Chapter</h2>
            <Diff current={chapterVersion || []} previous={version || []} />
          </div>
        </div>
        <Button className="ml-auto" onClick={() => {}}>
          Save revision
        </Button>
      </div>
    );
  },
);

VersionHistory.displayName = "VersionHistory";
