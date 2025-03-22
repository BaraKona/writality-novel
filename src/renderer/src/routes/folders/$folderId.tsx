import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover";
import { useFolderById } from "@renderer/hooks/folder/useFolderById";
import { createFileRoute } from "@tanstack/react-router";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Clock3, FileClock } from "lucide-react";
import { getTimeFromNow } from "@renderer/lib/utils";
import { custom_emojis } from "@renderer/lib/custom_emoji";

import { defaultDateTimeFormat } from "@shared/functions";
import { useUpdateFolder } from "@renderer/hooks/folder/useUpdateFolder";
import { ChapterListItem } from "@renderer/components/sidebar/ChapterListItem";
import { Button } from "@renderer/components/ui/button";
import { useState } from "react";
import { useDebounce } from "@renderer/hooks/useDebounce";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";

export const Route = createFileRoute("/folders/$folderId")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const { folderId } = Route.useParams();

  const { data: folder } = useFolderById(Number(folderId));
  const { mutate: updateFolder } = useUpdateFolder();

  const [addDescription, setAddDescription] = useState(false);

  const editor = useCreateEditor({ value: folder?.description });

  const debouncedFunc = useDebounce(
    (value) => updateFolder({ ...folder, description: value }),
    2000,
  );

  return (
    <div className="w-full">
      <div className="relative h-[35vh] bg-blend-lighten w-full bg-banner-3 bg-cover bg-center bg-no-repeat"></div>
      <div className="relative mx-auto h-full max-w-5xl px-16">
        <Popover>
          <PopoverTrigger className="absolute -top-18 z-10 text-[6em]">
            {folder?.emoji?.src ? (
              <img src={folder?.emoji?.src} alt="emoji" className="h-28 w-28" />
            ) : (
              folder?.emoji?.native || <span>📖</span>
            )}
          </PopoverTrigger>

          <PopoverContent className="border-0 p-0">
            <Picker
              data={data}
              custom={custom_emojis}
              onEmojiSelect={(e) =>
                folder && updateFolder({ ...folder, emoji: e })
              }
              theme="light"
              skinTonePosition="search"
            />
          </PopoverContent>
        </Popover>
        <section className="w-full space-y-4 px-2 pt-14">
          <h1
            className="text-editorText mt-4 min-h-fit font-serif-thick text-5xl ring-0 outline-none"
            contentEditable={true}
            onBlur={(e) =>
              folder &&
              updateFolder({
                ...folder,
                name: e.currentTarget.innerText.trim(),
              })
            }
            dangerouslySetInnerHTML={{
              __html: folder?.name || "",
            }}
          />
          <div className="flex gap-3">
            <div className="flex items-center gap-1 font-serif-thick text-muted-foreground italic">
              <FileClock size={16} className="text-text" />
              {defaultDateTimeFormat(folder?.created_at || "")}
            </div>
            <div className="flex items-center gap-1 font-serif-thick text-muted-foreground italic">
              <Clock3 size={16} className="text-text" />
              {getTimeFromNow(folder?.updated_at || "")}
            </div>
          </div>
          <div className="h-fit w-full space-y-3 rounded-lg bg-accent p-8 text-sm text-accent-foreground border">
            {folder?.description || addDescription ? (
              <BasicEditor
                editor={editor}
                setContent={(value) => debouncedFunc(value)}
                className="mt-4"
              />
            ) : (
              <div className="space-y-3">
                <div className="font-medium text-accent-foreground">
                  You have no description for this folder.
                </div>
                <div>
                  Descriptions are a great way to add some more information
                  about your folder. Detail what this folder is about, what you
                  plan to write in it, or anything else you want to keep in
                  mind.
                </div>
                <Button
                  variant="default"
                  onClick={() => setAddDescription(true)}
                >
                  Add Description
                </Button>
              </div>
            )}
          </div>
          <ChapterListItem chapters={folder?.chapters} />
        </section>
      </div>
    </div>
  );
}
