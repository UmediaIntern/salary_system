import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface DnDContextType {
  type: string | null;
  setType: (type: string | null) => void;
}

const dndContext = createContext<DnDContextType | null>(null);

export function DnDProvider({ children }: PropsWithChildren) {
  const [type, setType] = useState<string | null>(null);

  return (
    <dndContext.Provider value={{ type, setType }}>
      {children}
    </dndContext.Provider>
  );
}

export const useDnD = () => {
  const context = useContext(dndContext);
  if (context === null) {
    throw new Error(
      "useDnD must be used within a DnDProvider context"
    );
  }
  return context;
}
