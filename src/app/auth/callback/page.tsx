"use client";

import { useEffect } from "react";
import { useRouter, notFound } from "next/navigation";
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
    const handleRedirect = async () => {
      if (!session) return;

      // 👀 Debug log
      // console.log("user_metadata:", session.user.user_metadata);

      const userType = session.user.user_metadata.userType;
      // const firstLogin = session.user.user_metadata.firstLogin;

      // if (userType === "provider") {
      //   // Not first login → landing page
      //   router.replace("/landing-page");
      //   return;
      // }

      // if (userType === "client") {
      //   router.replace("/landing-page");
      //   return;
      // }

      if (userType === "client") {
        router.replace("/landing-page");
      } else if (userType === "provider") {
        router.replace("/dashboard");
      } else {
        notFound();
      }

      // fallback
      // router.replace("/");
    };

    handleRedirect();
  }, [session, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
