// context/ProviderContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

const ProviderContext = createContext(null);

export function ProviderProvider({ children }) {
  const [provider, setProvider] = useState(null);
  return (
    <ProviderContext.Provider value={{ provider, setProvider }}>
      {children}
    </ProviderContext.Provider>
  );
}

export function useProvider() {
  return useContext(ProviderContext);
}
