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
      <div className="bg-white h-[58px] flex items-center justify-center sticky top-[64px] z-40 border-b border-gray-200 px-4">
        <div className="flex items-center gap-2 sm:gap-4 max-w-4xl">
          {/* Step 1 - Completed */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
              <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <div className="w-8 sm:w-16 h-1 bg-green-500"></div>
          </div>
          
          {/* Step 2 - Active */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
              <span className="text-white text-xs sm:text-sm font-medium">2</span>
            </div>
            <div className="w-8 sm:w-16 h-1 bg-[#faf0df]"></div>
          </div>
          
          {/* Step 3 */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center border-2 border-[#faf0df]">
              <span className="text-gray-600 text-xs sm:text-sm font-medium">3</span>
            </div>
            <div className="w-8 sm:w-16 h-1 bg-[#faf0df]"></div>
          </div>
          
          {/* Step 4 */}
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center border-2 border-[#faf0df]">
            <span className="text-gray-600 text-xs sm:text-sm font-medium">4</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-6 sm:py-8 px-4">
        <div className="text-center w-full max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-6 sm:mb-8">Share Details of Your Project</h1>
          
          {/* Project Size Card */}
          <div className="bg-white rounded-lg p-6 sm:p-8 w-full shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-6 sm:mb-8">How big is your Project?</h2>
            
            <RadioGroup value={projectSize} onValueChange={setProjectSize} className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 text-left">
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="small" id="small" className="border-gray-400 flex-shrink-0" />
                <Label htmlFor="small" className="text-sm sm:text-base text-black cursor-pointer flex-1">
                  Small - Est. 1hr
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="medium" id="medium" className="border-gray-400 flex-shrink-0" />
                <Label htmlFor="medium" className="text-sm sm:text-base text-black cursor-pointer flex-1">
                  Medium - Est. 2-3hrs
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="large" id="large" className="border-gray-400 flex-shrink-0" />
                <Label htmlFor="large" className="text-sm sm:text-base text-black cursor-pointer flex-1">
                  Large - Est. 4hrs +
                </Label>
              </div>
            </RadioGroup>
            
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={handleBack}
                className="px-6 sm:px-8 py-3 w-full sm:w-auto"
              >
                Back
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-[rgba(254,159,43,1)] hover:bg-orange-600 border-2 border-orange-700 text-white font-black px-6 sm:px-8 py-3 rounded-[8px] w-full sm:w-auto"
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
