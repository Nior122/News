import React, { createContext, useContext, useState } from "react";

interface ActiveCategoryContextValue {
  activeCategory: string | null;
  setActiveCategory: (slug: string | null) => void;
}

const ActiveCategoryContext = createContext<ActiveCategoryContextValue>({
  activeCategory: null,
  setActiveCategory: () => {},
});

export function ActiveCategoryProvider({ children }: { children: React.ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  return (
    <ActiveCategoryContext.Provider value={{ activeCategory, setActiveCategory }}>
      {children}
    </ActiveCategoryContext.Provider>
  );
}

export function useActiveCategory() {
  return useContext(ActiveCategoryContext);
}
