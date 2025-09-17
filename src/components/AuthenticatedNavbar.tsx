"use client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, MessageSquare, FolderOpen } from "lucide-react";

export function AuthenticatedNavbar() {
  const { session, signOut } = useSession();
  const user = session?.user;
  const router = useRouter();

  const handleMyProjects = () => {
    router.push("/projects");
  };

  const handleInbox = () => {
    router.push("/inbox");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const fallbackLetter = user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  const userName = user?.user_metadata?.full_name || 
                   user?.email?.split('@')[0] || 
                   "User";

  return (
    <nav className="bg-white shadow-sm py-2 px-4 sm:px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-12">
        <div className="flex items-center">
          <img 
            src="/images/logo.png" 
            alt="HandyHive" 
            className="h-16 w-auto cursor-pointer" 
            onClick={() => router.push("/")}
          />
        </div>

        <div className="flex items-center gap-8">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Button
              variant="ghost"
              className="text-[16px] font-semibold text-black hover:text-[#fe9f2b] hover:bg-transparent flex items-center gap-2"
              onClick={handleMyProjects}
            >
              <FolderOpen className="w-4 h-4" />
              My Jobs
            </Button>

            <Button
              variant="ghost"
              className="text-[16px] font-semibold text-black hover:text-[#fe9f2b] hover:bg-transparent flex items-center gap-2"
              onClick={handleInbox}
            >
              <MessageSquare className="w-4 h-4" />
              Inbox
            </Button>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 hover:bg-gray-100">
                <span className="hidden md:block font-medium text-gray-700">
                  Good day, {userName}
                </span>
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user?.user_metadata?.profilePic}
                    alt="User Avatar"
                  />
                  <AvatarFallback className="bg-[#fe9f2b] text-white font-semibold">
                    {fallbackLetter}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.user_metadata?.profilePic}
                    alt="User Avatar"
                  />
                  <AvatarFallback className="bg-[#fe9f2b] text-white text-sm font-semibold">
                    {fallbackLetter}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile} className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings} className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut} 
                className="flex items-center gap-2 text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu for authenticated users */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMyProjects}
              className="p-2"
            >
              <FolderOpen className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleInbox}
              className="p-2"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
