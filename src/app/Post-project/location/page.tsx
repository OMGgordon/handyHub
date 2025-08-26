"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";

export default function LocationPage() {
  const router = useRouter();
  const [location, setLocation] = useState("");

  const handleNext = () => {
    if (location.trim()) {
      router.push("/Post-project/size");
    }
  };

  const handleBack = () => {
    router.push("/Post-project/categories");
  };

  return (
    <div className="min-h-screen bg-[#faf0df]">
      {/* Navbar */}
      <AuthenticatedNavbar />

        {/* Progress Indicator - Sticky */}
      <div className="bg-white h-[58px] flex items-center justify-center sticky top-[64px] z-40 border-b border-gray-200 px-4">
        <div className="flex items-center gap-2 sm:gap-4 max-w-4xl">
          {/* Step 1 - Active */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
              <span className="text-white text-xs sm:text-sm font-medium">1</span>
            </div>
            <div className="w-8 sm:w-16 h-1 bg-[#faf0df]"></div>
          </div>
          
          {/* Step 2 */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center border-2 border-[#faf0df]">
              <span className="text-gray-600 text-xs sm:text-sm font-medium">2</span>
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
      <div className="flex items-center justify-center py-6 sm:py-10 px-4">
        <div className="text-center w-full max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-8 sm:mb-12">Share Details of Your Project</h1>
          
          {/* Location Card */}
          <div className="bg-white rounded-lg p-6 sm:p-8 w-full shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-8 sm:mb-12">Enter the location of the project</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-12">
              <div className="flex-1">
                <Input
                  placeholder="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-[#fff7e7] border border-gray-300 rounded h-12 px-4 text-gray-600 placeholder:text-gray-500 w-full"
                />
              </div>
              <Button
                variant="outline"
                className="bg-[#faf0df] border border-gray-400 rounded h-12 w-12 flex items-center justify-center hover:bg-gray-100 self-center sm:self-auto"
              >
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </Button>
            </div>
            
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
                disabled={!location.trim()}
                className="bg-[rgba(254,159,43,1)] hover:bg-orange-600 border-2 border-orange-700 text-white font-black px-6 sm:px-8 py-3 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
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
