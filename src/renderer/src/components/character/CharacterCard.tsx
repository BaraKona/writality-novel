import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@renderer/components/ui/card";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { Button } from "@renderer/components/ui/button";
import { Badge } from "@renderer/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Value } from "@udecode/plate";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BasicEditor } from "../editor/BasicEditor";

interface CharacterCardProps {
  id: string | number;
  name: string;
  sex: string | null;
  age: number | null;
  description: Value;
  traits: string | null;
}

export function CharacterCard({
  name,
  sex,
  age,
  description,
  traits,
}: CharacterCardProps): JSX.Element {
  const characterEditor = useCreateEditor({
    value: description,
  });

  const parsedTraits = traits ? JSON.parse(traits) : [];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-xl">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{sex}</Badge>
              <span className="text-sm text-muted-foreground">
                {age} years old
              </span>
            </div>
          </div>
          <Avatar>
            <AvatarImage src={""} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {traits && traits.length > 0 && (
          <div className="mb-3">
            <span className="text-sm font-medium">Traits:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {parsedTraits?.map((trait, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {description && (
          <div>
            <span className="text-sm font-medium">Description:</span>
            <BasicEditor
              editor={characterEditor}
              setContent={() => {}}
              placeholder="Enter character description"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm" className="text-xs h-8">
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
