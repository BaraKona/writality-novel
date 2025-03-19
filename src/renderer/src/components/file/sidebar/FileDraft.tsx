import { FC } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { PencilRulerIcon, PlusIcon, ScissorsIcon } from "lucide-react";
import { Button } from "@renderer/components/ui/button";

export const FileDrafts: FC<{}> = ({}) => {
  const location = useLocation();
  const drafts = [] as any;
  const isLoading = false;
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex bg-border h-6 rounded-md items-center gap-2 py-1 px-2 text-xs text-secondaryText"
          />
        ))}
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col gap-0.5 grow">
      {drafts?.length === 0 || !drafts ? (
        <div className="w-full flex flex-col gap-0.5 items-center text-text">
          <div className="flex items-center mt-8 gap-2 text-sm">
            <PencilRulerIcon size={18} />
            No drafts yet.
          </div>
          <p className="text-xs mt-2 max-w-[250px] text-center mx-auto">
            You are editing your first draft. When you feel to refine your
            story, you can create aa new draft. You can also create multiple
            drafts and switch between them.
            {/* Polish your story and create a multiple revisions. */}
          </p>
          <Button className="mt-4 text-xs flex items-center gap-2 px-2">
            <PlusIcon size={16} strokeWidth={1.5} />
            Create draft
          </Button>
        </div>
      ) : (
        drafts.map((version, index) => (
          <div
            key={index}
            className="flex items-center gap-2 py-1 px-2 text-xs  hover:text-accent rounded-md cursor-default"
            onClick={() =>
              navigate({
                search: { ...location.search, version: version.name },
              })
            }
          >
            <div className=" flex gap-1 py-1">
              <ScissorsIcon size={16} />
              {version.name}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
