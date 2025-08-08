"use client";
import React from "react";
import { Navbar } from "@/components/Navbar";
import OnboardingModal from "@/components/OnboardingModal";

function OnboardingPage() {
  return (
    <div className="bg-[url('/man1.png')] h-screen  bg-cover">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[5px] h-screen"></div>
      <Navbar />
      <div className="">
        <OnboardingModal />
      </div>
    </div>
  );
}

export default OnboardingPage;
