"use client";

import { useState } from "react";
import { MapPin, Headphones, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";

export default function JobInfoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleManageProject = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMarkAsDone = () => {
    // Handle mark as done functionality
    console.log("Mark as done");
    closeModal();
  };

  const handleCancelProject = () => {
    // Handle cancel project functionality
    console.log("Cancel project");
    closeModal();
  };

  const handleGetHelp = () => {
    // Handle get help functionality
    console.log("Get help");
    closeModal();
  };

  return (
    <div className="min-h-screen bg-white">
      <AuthenticatedNavbar />

      <div className="bg-[#faf0df] h-[290px] overflow-hidden rounded-br-[200px] relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 h-full flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-[28px] sm:text-[36px] lg:text-[46px] font-bold text-black tracking-[-1.1px] leading-tight mb-4 lg:mb-8">
              Install or Replace a Water Heater
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-8 mb-4 lg:mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-[#757575]" />
                <span className="text-[14px] sm:text-[16px] text-[#282827]">
                  40 Mensah Wood Street, East Legon
                </span>
              </div>
              <div className="hidden sm:block w-[7px] h-[7px] bg-black rounded-full" />
              <div className="flex items-center gap-3">
                <Headphones className="w-6 h-6 text-[#757575]" />
                <span className="text-[14px] sm:text-[16px] text-[#282827]">
                  Project ID #226745211
                </span>
              </div>
            </div>

            <Button 
              onClick={handleManageProject}
              className="bg-white text-black border-2 border-[#757575] hover:bg-gray-50 h-[52px] px-9 rounded-[5px] text-[16px] font-bold"
            >
              Manage Project
            </Button>
          </div>

          <div className="w-[200px] h-[200px] lg:w-[250px] lg:h-[250px] mt-6 lg:mt-0">
            <div 
              className="w-full h-full bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: "url('/images/toolbox.png')" }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1">
            <h2 className="text-[20px] lg:text-[24px] font-bold text-black mb-6 lg:mb-8">Project details</h2>
            
            <Card className="rounded-[10px] overflow-hidden">
              <CardContent className="p-6 lg:p-12 space-y-6 lg:space-y-8">
                <div>
                  <p className="text-[16px] lg:text-[20px] text-black leading-[24px] lg:leading-[30px] mb-0">Service Category:</p>
                  <p className="text-[16px] lg:text-[20px] font-bold text-black leading-[24px] lg:leading-[30px]">Plumber</p>
                </div>

                <div>
                  <p className="text-[16px] lg:text-[20px] text-black leading-[24px] lg:leading-[30px] mb-0">Service Type:</p>
                  <p className="text-[16px] lg:text-[20px] font-bold text-black leading-[24px] lg:leading-[30px]">Repair</p>
                </div>

                <div>
                  <p className="text-[16px] lg:text-[20px] text-black leading-[24px] lg:leading-[30px] mb-0">
                    Preferred Start Date & Time:
                  </p>
                  <p className="text-[16px] lg:text-[20px] font-bold text-black leading-[24px] lg:leading-[30px]">
                    August 15, 2025  3:00pm
                  </p>
                </div>

                <div>
                  <p className="text-[16px] lg:text-[20px] text-black leading-[24px] lg:leading-[30px] mb-0">Budget Range:</p>
                  <p className="text-[16px] lg:text-[20px] font-bold text-black leading-[24px] lg:leading-[30px]">
                    GHS 2,500 – GHS 4,000
                  </p>
                </div>

                <div>
                  <p className="text-[16px] lg:text-[20px] text-black leading-[24px] lg:leading-[30px] mb-4">
                    Job Description:
                  </p>
                  <p className="text-[16px] lg:text-[20px] font-bold text-black leading-[24px] lg:leading-[30px] mb-4">
                    Looking for a certified plumber or technician to install or replace an existing electric water heater.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-[9999]"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg w-[90%] max-w-md mx-4 shadow-2xl relative z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-[24px] font-bold text-black">Manage project</h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Mark as done */}
                <button
                  onClick={handleMarkAsDone}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 border-b border-gray-200"
                >
                  <span className="text-[16px] text-gray-700">Mark as done</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                {/* Cancel project */}
                <button
                  onClick={handleCancelProject}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 border-b border-gray-200"
                >
                  <span className="text-[16px] text-gray-700">Cancel project</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                {/* Get help */}
                <button
                  onClick={handleGetHelp}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                >
                  <span className="text-[16px] text-gray-700">Get help</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}