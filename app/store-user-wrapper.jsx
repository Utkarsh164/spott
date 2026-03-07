"use client";

import { useStoreUser } from "@/hooks/use-store-user";

export function StoreUserWrapper({ children }) {
  useStoreUser(); // Ensure user is stored in Convex when authenticated
  return children;
}
