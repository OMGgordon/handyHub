"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import SignInForm from "@/components/SignInForm";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/context/SessionProvider";

function AuthPage() {
  //   const [session, setSession] = useState<any>(null);
  //   const router = useRouter();

  //   const fetchSession = async () => {
  //     const currentSession = await supabase.auth.getSession();
  //     setSession(currentSession.data.session);
  //   };

  //   useEffect(() => {
  //     fetchSession();
  //     const {
  //       data: { subscription },
  //     } = supabase.auth.onAuthStateChange((event, session) => {
  //       if (session) {
  //         router.push("/landing-page");
  //       }
  //     });

  //     return () => subscription.unsubscribe();
  //   }, []);

  //   console.log("session.user", session?.user);

  return (
    <div className="min-h-screen flex items-center justify-center font-segoe p-4">
      <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Sign In Form */}
        <SignInForm />

        {/* Image Section */}
        <div className="hidden lg:block">
          <Image
            aria-hidden
            src="/sign.png"
            alt="man smiling"
            width={702}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
