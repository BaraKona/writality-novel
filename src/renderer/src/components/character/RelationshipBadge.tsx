import { fractalCharacterRelationshipsTable } from "@db/schema";
import { Heart, Users, Skull, User, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@renderer/lib/utils";

const relationshipIcons = {
  family: Users,
  friend: Heart,
  enemy: Skull,
  other: User,
} as const;

const relationshipColors = {
  family: "bg-blue-100 text-blue-700",
  friend: "bg-green-100 text-green-700",
  enemy: "bg-red-100 text-red-700",
  other: "bg-gray-100 text-gray-700",
} as const;

const relationshipLabels = {
  family: "Family",
  friend: "Friend",
  enemy: "Enemy",
  other: "Other",
} as const;

type RelationshipType = keyof typeof relationshipIcons;

export type RelationshipBadgeProps = {
  rel: typeof fractalCharacterRelationshipsTable.$inferSelect;
  direction: "incoming" | "outgoing";
};

export function RelationshipBadge({
  rel,
  direction,
}: RelationshipBadgeProps): JSX.Element {
  const type = (
    rel.relationship_type in relationshipIcons ? rel.relationship_type : "other"
  ) as RelationshipType;
  const Icon = relationshipIcons[type];
  const colorClass = relationshipColors[type];
  const label = relationshipLabels[type];

  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
        colorClass,
      )}
    >
      {direction === "incoming" ? (
        <ArrowLeft className="w-3 h-3" />
      ) : (
        <ArrowRight className="w-3 h-3" />
      )}
      <Icon className="w-3 h-3" />
      <span>{label}</span>
    </div>
  );
}
