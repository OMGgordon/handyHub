"use client"
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/context/SessionProvider";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  onNavigateToSignIn?: () => void;
}

export function Navbar({ onNavigateToSignIn }: NavbarProps) {
  const { session, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogin = () => {
    router.push("/auth");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const fallbackLetter = session?.user?.email
    ? session.user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <nav className="sticky top-0 z-50  h-[94px] flex  items-center justify-between px-6 lg:px-8">
      <div className="flex items-center">
        <img src="/images/logo.png" alt="HandyHive" className="h-16 w-auto" />
      </div>

      {!loading &&
        (session ? (
          <div className="font-extrabold flex flex-row items-center justify-around gap-6">
            <div className="hidden md:flex space-x-4">
              <span
                onClick={() => router.push("/projects")}
                className={`cursor-pointer ${
                  pathname === "/projects" ? "text-primary font-semibold" : ""
                }`}
              >
                My projects
              </span>
              <span
                onClick={() => router.push("/inbox")}
                className={`cursor-pointer ${
                  pathname === "/inbox" ? "text-primary font-semibold" : ""
                }`}
              >
                Inbox
              </span>
            </div>
            <div className="flex flex-row items-center justify-between gap-2">
              <span className="">Good day</span>
              <Avatar>
                <AvatarImage
                  src={session?.user?.user_metadata?.profilePic}
                  alt="User Avatar"
                />
                <AvatarFallback>{fallbackLetter}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        ) : (
          <div>
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-[16px] font-semibold text-black">
                Join as a Service Provider
              </span>

              <Button
                variant="outline"
                className="border-[#867f7f] text-black font-semibold px-6 h-11 rounded-[10px]"
                onClick={handleLogin}
              >
                Login
              </Button>

              <Button
                className="bg-[#fe9f2b] hover:bg-[#e8891a] text-white font-semibold px-6 h-11 rounded-[10px]"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>

              {/* Mobile menu button */}
            </div>
            <div className="md:hidden">
              <Button variant="outline" size="sm" onClick={handleLogin}>
                Login
              </Button>
            </div>
          </div>
        ))}
    </nav>
  );
}
