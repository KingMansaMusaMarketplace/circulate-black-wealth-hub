import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * AdminShadowMode
 * A self-imposed read-only mode for admins-in-training. When enabled, the
 * `blockIfShadow()` helper returns true, which destructive actions check and
 * refuse. Persisted in localStorage per browser (client-side guard only —
 * server RLS is the real security boundary).
 */
type Ctx = {
  shadowMode: boolean;
  setShadowMode: (v: boolean) => void;
  blockIfShadow: (label?: string) => boolean;
};

const AdminShadowContext = createContext<Ctx>({
  shadowMode: false,
  setShadowMode: () => {},
  blockIfShadow: () => false,
});

const STORAGE_KEY = "admin_shadow_mode";

export function AdminShadowModeProvider({ children }: { children: React.ReactNode }) {
  const [shadowMode, setShadowModeState] = useState(false);

  useEffect(() => {
    setShadowModeState(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const setShadowMode = (v: boolean) => {
    setShadowModeState(v);
    localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
  };

  const blockIfShadow = (label = "This action") => {
    if (shadowMode) {
      // Imported dynamically to keep this context tree-shakeable
      import("sonner").then(({ toast }) =>
        toast.error(`${label} is disabled in Shadow Mode`, {
          description: "Turn off Shadow Mode in the header to make real changes.",
        })
      );
      return true;
    }
    return false;
  };

  return (
    <AdminShadowContext.Provider value={{ shadowMode, setShadowMode, blockIfShadow }}>
      {children}
    </AdminShadowContext.Provider>
  );
}

export const useAdminShadowMode = () => useContext(AdminShadowContext);
