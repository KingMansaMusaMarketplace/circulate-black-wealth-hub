import { useFoundingSlots } from "@/hooks/useFoundingSlots";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface Props {
  className?: string;
}

export const FoundingSlotBadge = ({ className }: Props) => {
  const { remaining, isFull, loading } = useFoundingSlots();
  if (loading) return null;
  return (
    <Badge
      variant="outline"
      className={`gap-1 border-mansagold/40 bg-mansagold/10 text-mansagold ${className ?? ""}`}
    >
      <Sparkles className="h-3 w-3" />
      {isFull
        ? "Founding 100 sold out"
        : `${remaining} of 100 Founding spots left`}
    </Badge>
  );
};

export default FoundingSlotBadge;
