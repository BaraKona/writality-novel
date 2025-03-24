import { getDateFromTime, getTimeFromNow } from "@renderer/lib/utils";
import {
  FileClock,
  FileSignature,
  FileText,
  Plus,
  Share,
  Trash2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { chaptersTable } from "@db/schema";

export const ChapterListItem = ({
  chapters,
}: {
  chapters?: (typeof chaptersTable.$inferSelect)[];
}): JSX.Element => {
  return (
    <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-3">
      <div className="col-span-1 hover:border-foreground/25 grid cursor-pointer place-items-center gap-1 rounded-xl p-4 text-center border">
        <div>
          <Plus size={24} className="mx-auto stroke-muted-foreground" />
          <div className="text-sm font-medium">Add new chapter to story</div>
        </div>
      </div>

      {chapters?.map((chapter) => (
        <Link
          to="/chapters/$chapterId"
          params={{ chapterId: chapter.id.toString() }}
          key={chapter.id}
          className="group hover:border-foreground/25 relative col-span-1 flex cursor-pointer flex-col rounded-xl border"
        >
          <FileText
            size={20}
            className="mx-4 mt-4 shrink-0 stroke-muted-foreground"
          />
          <div className="max-w-fit p-4 font-serif text-xl font-medium">
            <div className="line-clamp-2">{chapter.name}</div>
          </div>

          <div className="mt-auto flex justify-between gap-8 border-t p-4">
            <div className="flex items-center gap-2 text-xs">
              <FileClock
                size={16}
                className="shrink-0 stroke-muted-foreground"
              />
              <span className="text-muted-foreground">
                {getDateFromTime(chapter.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <FileSignature
                size={16}
                className="shrink-0 stroke-muted-foreground"
              />
              <span className="text-muted-foreground">
                {getTimeFromNow(chapter.updated_at)}
              </span>
            </div>
          </div>
          <div className="absolute -top-2 right-2 hidden w-fit gap-0.5 rounded-md bg-white p-1 text-xs border border-foreground/20 group-hover:flex">
            <Button size="icon" variant="ghost" className="p-0.75">
              <Share size={16} className="shrink-0" />
            </Button>
            <Button size="icon" variant="ghost" className="p-0.75">
              <Trash2 size={16} className="shrink-0" />
            </Button>
          </div>
        </Link>
      ))}
    </div>
  );
};
