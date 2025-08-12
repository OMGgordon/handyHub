import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function LandingNavbar() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleJoinAsServiceProvider = () => {
    router.push("/ServiceProviderProfile");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white h-[94px] flex items-center justify-between px-6 lg:px-8 shadow-sm">
      <div className="flex items-center">
        <img src="/images/logo.png" alt="HandyHive" className="h-16 w-auto" />
      </div>

      <div>
        <div className="hidden md:flex items-center space-x-6">
          <Button
            variant="ghost"
            className="text-[16px] font-semibold text-black hover:text-[#fe9f2b] hover:bg-transparent"
            onClick={handleJoinAsServiceProvider}
          >
            Join as a Service Provider
          </Button>

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
