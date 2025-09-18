import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function LandingNavbar() {
  const router = useRouter();

  const handleJoinAsServiceProvider = () => {
    router.push("/signup-sp");
  };

  const handleLogin = () => {
    router.push("/auth");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <nav className="bg-white shadow-sm py-2 px-4 sm:px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-12">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/Logo.png"
            alt="HandyHive Logo"
            width={120}
            height={32}
            className="h-12 w-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleJoinAsServiceProvider}
            className="text-gray-700 hover:text-[#fe9f2b] hover:bg-transparent text-sm"
          >
            Join as a Handyman
          </Button>

          <Button
            variant="outline"
            onClick={handleLogin}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-4 py-1.5"
          >
            Login
          </Button>

          <Button
            onClick={handleSignUp}
            className="bg-[#fe9f2b] hover:bg-[#e8891a] text-white text-sm px-4 py-1.5"
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Button variant="outline" size="sm" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
