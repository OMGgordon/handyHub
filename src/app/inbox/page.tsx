"use client";
import { Navbar } from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useSession } from "@/context/SessionProvider";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function InboxPage() {
  const { session, loading } = useSession();
  const fallbackLetter = session?.user?.email
    ? session.user.email.charAt(0).toUpperCase()
    : "U";
  return (
    <div>
      <div>
        <Navbar />
        <Separator />
      </div>

      <div className="flex flex-row">
        {/* list of messages */}
        <div className="w-1/3">
          <div className="space-y-2">
            <h1 className="font-semibold text-xl font-segoe p-3">Inbox</h1>
            <Separator />
          </div>
          <div>
            <Avatar>
              <AvatarImage
                src={session?.user?.user_metadata?.profilePic}
                alt="User Avatar"
              />
              <AvatarFallback>{fallbackLetter}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div>
          <Separator />
        </div>
        {/* actual chat screen/empty state */}
        <div className="flex-1 items-center justify-center">
          <p>Select a message to start chatting</p>
        </div>
      </div>
    </div>
  );
}

export default InboxPage;
