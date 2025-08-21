"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/context/SessionProvider";

export default function AuthCallbackPage() {
  const router = useRouter();

  // useEffect(() => {
  //   const handleAuth = async () => {
  //     const { error } = await supabase.auth.getSession();

  //     if (error) {
  //       console.error("Error getting session:", error);
  //     }

  //     // ✅ Supabase already auto-stores the session for email links
  //     // We just wait and redirect
  //     router.replace("/onboarding-page");
  //   };

  //   handleAuth();
  // }, [router]);

  const { session } = useSession();

  useEffect(() => {
    if (session) {
      const { userType, firstLogin } = session.user.user_metadata;

      if (userType === "provider") {
        //if its provider and first time, so only after sign up
        if (firstLogin) {
          router.replace("/onboarding-page");

          // clear the flag so next time they don’t go to onboarding
          supabase.auth.updateUser({
            data: { firstLogin: false },
          });
        } else {
          console.log("redirecting provider to onboarding");
          router.replace("/landing-page");
        }
      } else if (userType === "client") {
        console.log("redirecting client to dashboard");
        router.replace("/landing-page");
      } else {
        console.log("no userType found, redirecting to fallback");
        router.replace("/");
      }
    } else return;
  }, [session, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
