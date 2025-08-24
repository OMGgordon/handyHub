"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";

export default function SizePage() {
  const router = useRouter();
  const [projectSize, setProjectSize] = useState("medium");

  const handleNext = () => {
    router.push("/Post-project/description");
  };

  const handleBack = () => {
    router.push("/Post-project/location");
  };

  return (
    <div className="min-h-screen bg-[#faf0df]">
      {/* Navbar */}
      <AuthenticatedNavbar />

      {/* Progress Indicator */}
      <div className="bg-white h-[58px] flex items-center justify-center">
        <div className="flex items-center gap-4 max-w-4xl">
          {/* Step 1 - Completed */}
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <div className="w-16 h-1 bg-green-500"></div>
          </div>
          
          {/* Step 2 - Active */}
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
              <span className="text-white text-sm font-medium">2</span>
            </div>
            <div className="w-16 h-1 bg-[#faf0df]"></div>
          </div>
          
          {/* Step 3 */}
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-[#faf0df]">
              <span className="text-gray-600 text-sm font-medium">3</span>
            </div>
            <div className="w-16 h-1 bg-[#faf0df]"></div>
          </div>
          
          {/* Step 4 */}
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-[#faf0df]">
            <span className="text-gray-600 text-sm font-medium">4</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-8">Share Details of Your Project</h1>
          
          {/* Project Size Card */}
          <div className="bg-white rounded-lg p-8 w-[615px] shadow-sm">
            <h2 className="text-1xl font-semibold text-black mb-8">How big is your Project?</h2>
            
            <RadioGroup value={projectSize} onValueChange={setProjectSize} className="space-y-6 mb-8 text-left">
              <div className="flex items-center space-x-4">
                <RadioGroupItem value="small" id="small" className="border-gray-400" />
                <Label htmlFor="small" className="text-base text-black cursor-pointer">
                  Small - Est. 1hr
                </Label>
              </div>
              
              <div className="flex items-center space-x-4">
                <RadioGroupItem value="medium" id="medium" className="border-gray-400" />
                <Label htmlFor="medium" className="text-base text-black cursor-pointer">
                  Medium - Est. 2-3hrs
                </Label>
              </div>
              
              <div className="flex items-center space-x-4">
                <RadioGroupItem value="large" id="large" className="border-gray-400" />
                <Label htmlFor="large" className="text-base text-black cursor-pointer">
                  Large - Est. 4hrs +
                </Label>
              </div>
            </RadioGroup>
            
            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={handleBack}
                className="px-8 py-3"
              >
                Back
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-[rgba(254,159,43,1)] hover:bg-orange-600 border-2 border-orange-700 text-white font-black px-8 py-3 rounded-[8px]"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
