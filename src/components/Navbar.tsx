"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/context/SessionProvider";
import { LandingNavbar } from "./LandingNavbar";
import { AuthenticatedNavbar } from "./AuthenticatedNavbar";

interface NavbarProps {
  onNavigateToSignIn?: () => void;
}

export function Navbar({ onNavigateToSignIn }: NavbarProps) {
  const { session, loading } = useSession();
  const router = useRouter();

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-white h-[94px] flex items-center justify-between px-6 lg:px-8 shadow-sm">
        <div className="flex items-center">
          <Image
            width={100}
            height={100}
            src="/logo.png"
            alt="HandyHive"
            className="h-16 w-auto cursor-pointer"
            onClick={() => router.push("/auth/callback")}
          />
          {/* <img src="/images/logo.png" alt="HandyHive" className="h-16 w-auto" /> */}
        </div>
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-md bg-gray-200 h-10 w-20"></div>
          <div className="rounded-md bg-gray-200 h-10 w-20"></div>
        </div>
      </nav>
    );
  }

  return session ? <AuthenticatedNavbar /> : <LandingNavbar />;
}
