"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import SignUpForm from "@/components/SignUpForm";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center font-segoe p-4">
      <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Sign Up Form */}
        <SignUpForm />

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

export default SignUpPage;
