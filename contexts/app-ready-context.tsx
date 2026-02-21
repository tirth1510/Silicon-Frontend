"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type AppReadyContextValue = {
  ready: boolean;
  setReady: (value: boolean) => void;
};

const AppReadyContext = createContext<AppReadyContextValue | null>(null);

export function AppReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReadyState] = useState(false);
  const setReady = useCallback((value: boolean) => {
    setReadyState(value);
  }, []);

  return (
    <AppReadyContext.Provider value={{ ready, setReady }}>
      {children}
    </AppReadyContext.Provider>
  );
}

export function useAppReady() {
  const ctx = useContext(AppReadyContext);
  if (!ctx) {
    return { ready: false, setReady: () => {} };
  }
  return ctx;
}
