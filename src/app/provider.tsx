"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { RootStore, RootStoreContext } from "@/stores/RootStores";

export default function Provider({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  const [root] = useState(() => new RootStore());
  return (
    <RootStoreContext.Provider value={root}>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </RootStoreContext.Provider>
  );
}
