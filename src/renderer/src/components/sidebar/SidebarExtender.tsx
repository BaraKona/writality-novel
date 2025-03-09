import { cn, onPointerDown } from "@renderer/lib/utils";
import clsx from "clsx";
import { FC, MutableRefObject } from "react";

export const SidebarExtender: FC<{
  width: number;
  setWidth: (width: number) => void;
  originalWidth: MutableRefObject<number>;
  originalClientX: MutableRefObject<number>;
  setDragging: (dragging: boolean) => void;
  setState: any;
  dragPosition?: "left" | "right";
  className?: string;
}> = ({
  width,
  setWidth,
  originalWidth,
  originalClientX,
  setDragging,
  setState,
  dragPosition = "right",
  className,
}) => {
  const positionStyle = dragPosition === "left" ? "-left-0.5" : "right-0.5";
  return (
    <div
      className={cn(
        "absolute top-0 pointer-events-auto bottom-0 w-0 flex-grow-0",
        className,
        positionStyle,
      )}
    >
      <div
        onPointerDown={(e) => {
          e.stopPropagation();
          onPointerDown({
            e,
            setDragging,
            originalWidth,
            originalClientX,
            setWidth,
            width,
            setState,
            sidebarPosition: dragPosition === "left" ? "right" : "left",
          });
        }}
        className={clsx(
          "h-full w-1 shrink-0 cursor-col-resize hover:bg-ring",
          className,
        )}
      />
    </div>
  );
};
