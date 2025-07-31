"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

function AuthPage() {
  const [session, setSession] = useState<any>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    setSession(currentSession.data.session);
  };

  useEffect(() => {
    // Check URL parameters to determine initial form
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }

    fetchSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-segoe items-center justify-center lg:space-x-8 p-4">
      <div className="w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <Button
            variant={!isSignUp ? "default" : "ghost"}
            className={`flex-1 ${!isSignUp ? "bg-white shadow-sm" : ""}`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </Button>
          <Button
            variant={isSignUp ? "default" : "ghost"}
            className={`flex-1 ${isSignUp ? "bg-white shadow-sm" : ""}`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </Button>
        </div>

        {/* Form Content */}
        {isSignUp ? (
          <SignUpForm />
        ) : (
          <SignInForm />
        )}
      </div>

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
  );
}

export default AuthPage;
