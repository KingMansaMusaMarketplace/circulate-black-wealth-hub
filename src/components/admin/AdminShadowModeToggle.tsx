import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAdminShadowMode } from "@/contexts/AdminShadowModeContext";

/**
 * Header toggle: put the admin dashboard into read-only "shadow mode".
 * Useful for demoing to investors or training a new admin.
 */
export function AdminShadowModeToggle() {
  const { shadowMode, setShadowMode } = useAdminShadowMode();
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-full border backdrop-blur-sm shadow-lg transition-colors ${
        shadowMode
          ? "bg-mansagold/20 border-mansagold/60 text-mansagold"
          : "bg-white/5 border-white/10 text-blue-200"
      }`}
      title={
        shadowMode
          ? "Shadow Mode ON — destructive actions blocked"
          : "Shadow Mode OFF — full admin access"
      }
    >
      {shadowMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      <Label htmlFor="shadow-toggle" className="text-xs cursor-pointer whitespace-nowrap">
        Shadow {shadowMode ? "ON" : "OFF"}
      </Label>
      <Switch
        id="shadow-toggle"
        checked={shadowMode}
        onCheckedChange={setShadowMode}
        className="scale-75"
      />
    </div>
  );
}
