import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialogue";
import { cn } from "@renderer/lib/utils";

export const Dialogue = ({
  trigger,
  children,
  title,
  description,
  className,
}: {
  trigger: JSX.Element;
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}): JSX.Element => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn("overflow-y-auto", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
