"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostProjectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first step of the project creation flow
    router.push("/Post-project/categories");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#faf0df] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to project creation...</p>
      </div>
    </div>
  );
}
