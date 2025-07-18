import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { nodeTypesEnum } from './nodes/node_type';

interface DnDContextType {
  type: nodeTypesEnum | null;
  setType: (type: nodeTypesEnum | null) => void;
}

const dndContext = createContext<DnDContextType | null>(null);

export function DnDProvider({ children }: PropsWithChildren) {
  const [type, setType] = useState<nodeTypesEnum | null>(null);

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
