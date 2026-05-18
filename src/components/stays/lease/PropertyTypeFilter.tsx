import React from "react";
import { Button } from "@/components/ui/button";
import { PROPERTY_TYPES, PropertyTypeValue } from "@/lib/lease/property-types";
import { cn } from "@/lib/utils";

interface Props {
  value: PropertyTypeValue | null;
  onChange: (v: PropertyTypeValue | null) => void;
  className?: string;
}

const PropertyTypeFilter: React.FC<Props> = ({ value, onChange, className }) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        type="button"
        size="sm"
        variant={value === null ? "default" : "outline"}
        onClick={() => onChange(null)}
        className={cn(
          "min-h-[40px]",
          value === null
            ? "bg-mansagold text-black hover:bg-mansagold/90 font-bold"
            : "border-white/30 text-white hover:bg-white/10"
        )}
      >
        All Types
      </Button>
      {PROPERTY_TYPES.map((t) => {
        const Icon = t.icon;
        const active = value === t.value;
        return (
          <Button
            key={t.value}
            type="button"
            size="sm"
            variant={active ? "default" : "outline"}
            onClick={() => onChange(active ? null : t.value)}
            className={cn(
              "min-h-[40px] gap-1",
              active
                ? "bg-mansagold text-black hover:bg-mansagold/90 font-bold"
                : "border-white/30 text-white hover:bg-white/10"
            )}
          >
            <Icon className="w-4 h-4" />
            {t.labelPlural}
          </Button>
        );
      })}
    </div>
  );
};

export default PropertyTypeFilter;
