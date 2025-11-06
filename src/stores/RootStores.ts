"use client";
import { createContext, useContext } from "react";
import { PeopleStore } from "./PeopleStore";

export class RootStore {
  people = new PeopleStore();
}
export const RootStoreContext = createContext<RootStore | null>(null);
export const useRootStore = () => {
  const s = useContext(RootStoreContext);
  if (!s) throw new Error("RootStoreContext is null");
  return s;
};
