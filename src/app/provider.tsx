"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { RootStore, RootStoreContext } from "@/stores/RootStores";

// Use react query for cash results
const Provider = ({ children }: { children: ReactNode }) => {
  // State for safe result react-query response
  const [qc] = useState(() => new QueryClient());
  const [root] = useState(() => new RootStore());
  return (
    <RootStoreContext.Provider value={root}>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </RootStoreContext.Provider>
  );
};

export default Provider;
