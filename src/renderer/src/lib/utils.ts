import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PointerEvent as ReactPointerEvent } from "react";
import { Open } from "@renderer/routes/__root";

dayjs.extend(relativeTime);

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export function getTimeFromNow(date?: string | Date | number | null): string {
  return dayjs(date).fromNow();
}

export function defaultDateTimeFormat(date: string | Date | number): string {
  return dayjs(date).format("dddd MMM D YYYY, h:mm a");
}

export function getDateFromTime(date: string | Date | number): string {
  return dayjs(date).format("MMM D YYYY");
}

export function getMonthFromTime(date: string | Date | number): string {
  return dayjs(date).format("MMMM");
}

export function getYearFromTime(date: string | Date | number): string {
  return dayjs(date).format("YYYY");
}

export function getMonthAndYearFromTime(date: string | Date | number): string {
  return dayjs(date).format("MMMM YYYY");
}

export const clamp = (
  number: number,
  boundOne: number,
  boundTwo: number,
): number => {
  if (!boundTwo) {
    return Math.max(number, boundOne) === boundOne ? number : boundOne;
  } else if (Math.min(number, boundOne) === number) {
    return boundOne;
  } else if (Math.max(number, boundTwo) === number) {
    return boundTwo;
  }
  return number;
};

export function greetingTime(): string {
  const currentHour = dayjs().hour();
  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good afternoon";
  } else if (currentHour >= 18 && currentHour < 22) {
    return "Good evening";
  } else {
    return "Good night";
  }
}

export function onPointerDown({
  e,
  originalWidth,
  originalClientX,
  setDragging,
  setWidth,
  setState,
  width,
  sidebarPosition = "left",
}: {
  e: ReactPointerEvent;
  originalWidth: React.MutableRefObject<number>;
  originalClientX: React.MutableRefObject<number>;
  setDragging: (dragging: boolean) => void;
  setWidth: (width: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (state: any) => void;
  width: number;
  sidebarPosition: "left" | "right";
}): void {
  // this prevents dragging from selecting
  e.preventDefault();

  const { ownerDocument } = e.currentTarget;
  originalWidth.current = width;
  originalClientX.current = e.clientX;
  setDragging(true);

  function onPointerMove(e: PointerEvent): void {
    console.log({
      sidebarPosition,
      windowWidth: window.innerWidth,
      clientX: e.clientX,
    });
    if (sidebarPosition === "right" && e.clientX > window.innerWidth - 50) {
      setState((prev) => ({
        state: Open.Closed,
        category: prev.category,
      }));
    } else if (sidebarPosition === "left" && e.clientX < 50) {
      setState(Open.Closed);
    } else if (sidebarPosition === "right") {
      setState((prev) => ({
        state: Open.Open,
        category: prev.category,
      }));
    } else {
      setState(Open.Open);
    }

    if (sidebarPosition === "right") {
      setWidth(
        // clamp the width between 200 and 500
        Math.floor(
          clamp(
            originalWidth.current - e.clientX + originalClientX.current,
            300,
            500,
          ),
        ),
      );
    } else {
      setWidth(
        // clamp the width between 200 and 500
        Math.floor(
          clamp(
            originalWidth.current + e.clientX - originalClientX.current,
            300,
            500,
          ),
        ),
      );
    }
  }

  function onPointerUp(): void {
    ownerDocument.removeEventListener("pointermove", onPointerMove);
    setDragging(false);
  }

  ownerDocument.addEventListener("pointermove", onPointerMove);
  ownerDocument.addEventListener("pointerup", onPointerUp, {
    once: true,
  });
}

export const getTextContentFromRichContent = (
  content: Array<{ text?: string; children?: Array<string> }>,
): string => {
  const getText = (node: {
    text?: string;
    children?: Array<string>;
  }): string => {
    // @ts-ignore because children is an array of strings
    if (node === "\n") {
      return "";
    }
    if (node.text) {
      return node.text;
    }
    if (node.children) {
      // @ts-ignore because children is an array of strings
      return node.children.map(getText).join(" ");
    }
    return "";
  };
  return content
    .map(getText)
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim(); // Trim leading and trailing spaces
};

export const getWordCountFromRichContent = (
  content?: Array<{ text?: string; children?: Array<string> }>,
): number => {
  if (!content) {
    return 0;
  }

  const text = getTextContentFromRichContent(content);
  // Remove punctuation before counting words
  const words = text.trim().split(/\s+/);
  return words.length;
};
