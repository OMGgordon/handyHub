"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Clock, Calendar, Banknote, Image } from "lucide-react";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";

export default function PreviewPage() {
  const router = useRouter();

  const projectDetails = {
    location: "East legon, Accra",
    duration: "Medium - 2-3hrs",
    description: "Hi! Looking for help updating my 650 sq ft apartment. I'm on the 2nd floor up a short flight of stairs. Please bring an electric drill and ring doorbell number 3. Thanks!",
    startDate: "August 15, 2025",
    budget: "2,500 - 4,000",
    images: 3
  };

  const handleBack = () => {
    router.push("/Post-project/date-budget");
  };

  const handleConfirm = () => {
    // Navigate back to home or projects page after confirmation
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#faf0df]">
      {/* Navbar */}
      <AuthenticatedNavbar />

        {/* Progress Indicator - Sticky */}
      <div className="bg-white h-[58px] flex items-center justify-center sticky top-[64px] z-40 border-b border-gray-200">
        <div className="flex items-center gap-4 max-w-4xl">
          {/* All Steps Completed */}
          {[1, 2, 3, 4].map((step, index) => (
            <div key={step} className="flex items-center gap-4">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              </div>
              {index < 3 && <div className="w-16 h-1 bg-green-500"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-8">Share Details of Your Project</h1>
          
          {/* Preview Card */}
          <div className="bg-white rounded-lg p-8 w-[615px] shadow-sm">
            <h2 className="text-1xl font-semibold text-black text-center mb-4">
              Details Shared
            </h2>
            
            <p className="text-sm text-gray-700 text-center mb-8 max-w-[496px] mx-auto">
              We use these details to show Service Providers in your area who fit your needs.
            </p>

            <div className="space-y-4 mb-8">
              {/* Project Location */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-4 relative">
                <button 
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/Post-project/location")}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <div className="text-sm font-medium text-black mb-2 text-left">Your Project location</div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-bold text-black">{projectDetails.location}</span>
                </div>
              </div>

              {/* Project Duration */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-4 relative">
                <button 
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/Post-project/size")}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <div className="text-sm font-medium text-black mb-2 text-left">Your project duration</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-bold text-black">{projectDetails.duration}</span>
                </div>
              </div>

              {/* Project Description */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-4 relative">
                <button 
                  className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/Post-project/description")}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <div className="text-sm font-medium text-black mb-2 text-left">Project description</div>
                <p className="text-sm text-gray-500 pr-8 text-left">{projectDetails.description}</p>
              </div>

              {/* Project Images */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-4 relative">
                <button 
                  className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/Post-project/description")}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <div className="text-sm font-medium text-black mb-2 text-left">Project images</div>
                <div className="flex gap-2">
                  {Array.from({ length: projectDetails.images }).map((_, index) => (
                    <div key={index} className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferred Start Date */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-4 relative">
                <button 
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/Post-project/date-budget")}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <div className="text-sm font-medium text-black mb-2 text-left">Preferred start date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-bold text-black">{projectDetails.startDate}</span>
                </div>
              </div>

              {/* Budget Range */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-4 relative">
                <button 
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/Post-project/date-budget")}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <div className="text-sm font-medium text-black mb-2 text-left">Budget range (GH₵)</div>
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-bold text-black">{projectDetails.budget}</span>
                </div>
              </div>
            </div>

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
                onClick={handleConfirm}
                className="bg-[rgba(254,159,43,1)] hover:bg-orange-600 border-2 border-orange-700 text-white font-black px-12 py-3 rounded-[8px] w-[310px]"
              >
                Confirm and Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
