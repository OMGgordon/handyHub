"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";

export default function DateBudgetPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [budget, setBudget] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleNext = () => {
    if (startDate.trim() && budget.trim()) {
      router.push("/Post-project/preview");
    }
  };

  const handleBack = () => {
    router.push("/Post-project/description");
  };

  const handleCalendarClick = () => {
    // Focus on the hidden date input to open the native date picker
    const dateInput = document.getElementById('date-input') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf0df]">
      {/* Navbar */}
      <AuthenticatedNavbar />

      {/* Progress Indicator - Sticky */}
      <div className="bg-white h-[58px] flex items-center justify-center sticky top-[64px] z-40 border-b border-gray-200">
        <div className="flex items-center gap-4 max-w-4xl">
          {/* Step 1 - Completed */}
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
              <span className="text-white text-sm font-medium">✓</span>
            </div>
            <div className="w-16 h-1 bg-green-500"></div>
          </div>
          
          {/* Step 2 - Completed */}
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
              <span className="text-white text-sm font-medium">✓</span>
            </div>
            <div className="w-16 h-1 bg-green-500"></div>
          </div>
          
          {/* Step 3 - Completed */}
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
              <span className="text-white text-sm font-medium">✓</span>
            </div>
            <div className="w-16 h-1 bg-green-500"></div>
          </div>
          
          {/* Step 4 - Active */}
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
            <span className="text-white text-sm font-medium">4</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-8">Share Details of Your Project</h1>
          
          {/* Date & Budget Card */}
          <div className="bg-white rounded-lg p-8 w-[615px] shadow-sm">
            <h2 className="text-1xl font-semibold text-black mb-12">When would you like to start and what's your budget?</h2>
            
            {/* Start Date */}
            <div className="mb-8">
              <label className="block text-left text-gray-700 font-medium mb-3">
                When would you like to start?
              </label>
              <div className="flex gap-3 relative">
                <div className="flex-1 relative">
                  {/* Hidden date input */}
                  <input
                    id="date-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {/* Visible input */}
                  <Input
                    placeholder="Select start date"
                    value={startDate ? new Date(startDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : ""}
                    readOnly
                    className="bg-[#fff7e7] border border-gray-300 rounded h-12 px-4 text-gray-600 cursor-pointer"
                    onClick={handleCalendarClick}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleCalendarClick}
                  className="bg-[#faf0df] border border-gray-400 rounded h-12 w-12 flex items-center justify-center hover:bg-gray-100"
                >
                  <Calendar className="w-6 h-6 text-black" />
                </Button>
              </div>
            </div>

            {/* Budget */}
            <div className="mb-12">
              <label className="block text-left text-gray-700 font-medium mb-3">
                What's your budget range?
              </label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="e.g. GHS 500 - 1000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="bg-[#fff7e7] border border-gray-300 rounded h-12 px-4 text-gray-600 placeholder:text-gray-500"
                  />
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
                onClick={handleNext}
                disabled={!startDate.trim() || !budget.trim()}
                className="bg-[rgba(254,159,43,1)] hover:bg-orange-600 border-2 border-orange-700 text-white font-black px-8 py-3 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
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
