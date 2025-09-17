"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  id: string;
  name?: string | null;
  avatar?: string | null;
  full_name?: string | null; // if stored differently
  // add any fields you want to reuse
};

type UserContextType = {
  getClientById: (clientId: string) => Promise<UserProfile | null>;
  getProviderById: (providerId: string) => Promise<UserProfile | null>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // cache so we don’t refetch the same users repeatedly
  const [cache, setCache] = useState<Record<string, UserProfile>>({});

  const getClientById = async (clientId: string) => {
    if (cache[clientId]) return cache[clientId];

    const { data, error } = await supabase
      .from("users") // 👈 your clients table
      .select("id, name, avatar")
      .eq("id", clientId)
      .single();

    if (error) {
      console.error("Error fetching client:", error);
      return null;
    }

    setCache((prev) => ({ ...prev, [clientId]: data }));
    return data;
  };

  const getProviderById = async (providerId: string) => {
    if (cache[providerId]) return cache[providerId];

    const { data, error } = await supabase
      .from("service_providers") // 👈 your providers table
      .select("id, full_name, avatar")
      .eq("id", providerId)
      .single();

    if (error) {
      console.error("Error fetching provider:", error);
      return null;
    }

    setCache((prev) => ({ ...prev, [providerId]: data }));
    return data;
  };

  return (
    <UserContext.Provider value={{ getClientById, getProviderById }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used inside UserProvider");
  return ctx;
}
