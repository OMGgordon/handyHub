"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
      }

      // ✅ Supabase already auto-stores the session for email links
      // We just wait and redirect
      router.replace("/dashboard");
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
