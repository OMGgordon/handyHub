"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";

export default function DescriptionPage() {
  const router = useRouter();
  const [projectDescription, setProjectDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleNext = () => {
    if (projectDescription.trim()) {
      router.push("/Post-project/date-budget");
    }
  };

  const handleBack = () => {
    router.push("/Post-project/size");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedImages(prev => [...prev, ...files]);
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
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <div className="w-16 h-1 bg-green-500"></div>
          </div>
          
          {/* Step 2 - Completed */}
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <div className="w-16 h-1 bg-green-500"></div>
          </div>
          
          {/* Step 3 - Active */}
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
              <span className="text-white text-sm font-medium">3</span>
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
          
          {/* Description Card */}
          <div className="bg-white rounded-lg p-8 w-[615px] shadow-sm">
            <h2 className="text-1xl font-semibold text-black text-center mb-4">
              Tell us the details of your Project
            </h2>
            
            <p className="text-sm text-gray-700 text-center mb-8 max-w-[496px] mx-auto">
              Start the conversation and tell your Service Provider what you need done. This helps us show you only qualified and available Taskers for the job. Don't worry, you can edit this later.
            </p>

            {/* Project Description */}
            <div className="mb-6">
              <Textarea
                placeholder="Project Description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="bg-[#fff7e7] border border-[#d4caca] rounded-md h-[111px] resize-none"
              />
            </div>

            {/* Project Images */}
            <div className="mb-8">
              <label className="block text-sm text-black mb-2 text-left">Project images</label>
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg h-[177px] flex flex-col items-center justify-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-gray-400">Upload Images</span>
                </label>
                
                {uploadedImages.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {uploadedImages.map((file, index) => (
                      <div key={index} className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
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
                disabled={!projectDescription.trim()}
                className="bg-[rgba(254,159,43,1)] hover:bg-orange-600 border-2 border-orange-700 text-white font-black px-12 py-3 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
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
