"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
//         router.push("/dashboard");
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, []);
  return (
    <div className="flex flex-row font-segoe space-x-4 items-center">
      <SignInForm />
      {/* <SignUpForm session={session} /> */}
      <div className="hidden lg:block ">
        <Image
          aria-hidden
          src="/sign.png"
          alt="man smiling"
          width={702}
          height={500}
        />
      </div>
    </div>
  );
}

export default AuthPage;
