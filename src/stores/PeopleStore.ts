"use client";
import { makeAutoObservable } from "mobx";

/** UI/model state not covered by React Query cache (filters, selection, etc.) */
export class PeopleStore {
  selectedPersonId: number | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  select(id: number | null) {
    this.selectedPersonId = id;
  }
}
