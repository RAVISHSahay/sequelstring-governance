import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { HelpCenter } from "@/components/help/HelpCenter";

interface HelpContextType {
  openHelp: (articleId?: string, category?: string) => void;
  closeHelp: () => void;
  isOpen: boolean;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function HelpProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [articleId, setArticleId] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();

  const openHelp = useCallback((newArticleId?: string, newCategory?: string) => {
    setArticleId(newArticleId);
    setCategory(newCategory);
    setIsOpen(true);
  }, []);

  const closeHelp = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <HelpContext.Provider value={{ openHelp, closeHelp, isOpen }}>
      {children}
      <HelpCenter
        open={isOpen}
        onOpenChange={setIsOpen}
        initialArticleId={articleId}
        initialCategory={category}
      />
    </HelpContext.Provider>
  );
}

export function useHelp() {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error("useHelp must be used within a HelpProvider");
  }
  return context;
}
