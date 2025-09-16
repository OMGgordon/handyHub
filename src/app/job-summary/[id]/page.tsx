"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Edit,
  MapPin,
  Clock,
  Calendar,
  Banknote,
  // Image,
  ToolCase,
  HandPlatter,
  NotebookPen,
} from "lucide-react";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PreviewPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    if (jobId) fetchJob();
  }, [jobId]);

  if (loading) return <p>Loading job profile...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!job) return <p>No job found</p>;

  console.log(job);

  const projectDetails = {
    location: "East legon, Accra",
    serviceType: "Repair",
    serviceCategory: "Plumbing",
    jobTitle: "Fix leaking sink",
    description:
      "Hi! Looking for help updating my 650 sq ft apartment. I'm on the 2nd floor up a short flight of stairs. Please bring an electric drill and ring doorbell number 3. Thanks!",
    startDate: "August 15, 2025 | 3:00 PM",
    budget: "2,500 - 4,000",
    images: 3,
  };

  const handleBack = () => {
    router.push("/Post-project/date-budget");
  };

  const handleConfirm = () => {
    // Navigate back to home or projects page after confirmation
    router.push(`/job-info/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-[#faf0df]">
      {/* Navbar */}
      <AuthenticatedNavbar />

      {/* Main Content */}
      <div className="flex items-center justify-center py-6 sm:py-8 px-4">
        <div className="text-center w-full max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-6 sm:mb-8">
            Booking Confirmation
          </h1>

          {/* Preview Card */}
          <div className="bg-white rounded-lg p-6 sm:p-8 w-full shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-black text-center mb-3 sm:mb-4">
              Job Summary
            </h2>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {/* Service Category */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-3 sm:p-4 relative">
                {/* <button 
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/job-details")}
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button> */}
                <div className="text-xs sm:text-sm font-medium text-black mb-2 text-left pr-8">
                  Service Category
                </div>
                <div className="flex items-center gap-2">
                  <ToolCase className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-black">
                    {job.service_category}
                  </span>
                </div>
              </div>

              {/* Service Type */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-3 sm:p-4 relative">
                {/* <button 
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/job-details")}
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button> */}
                <div className="text-xs sm:text-sm font-medium text-black mb-2 text-left pr-8">
                  Service Type
                </div>
                <div className="flex items-center gap-2">
                  <HandPlatter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-black">
                    {job.service_type}
                  </span>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-3 sm:p-4 relative">
                {/* <button 
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("job-details")}
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button> */}
                <div className="text-xs sm:text-sm font-medium text-black mb-2 text-left pr-8">
                  Date & Time
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-black">
                    {`${new Date(job.date[0]).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })} → ${new Date(
                      job.date[job.date?.length - 1]
                    ).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}`}
                  </span>
                </div>
              </div>

              {/* job Location */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-3 sm:p-4 relative">
                {/* <button 
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/job-details")}
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button> */}
                <div className="text-xs sm:text-sm font-medium text-black mb-2 text-left pr-8">
                  Job Location
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-black">
                    {job.location}
                  </span>
                </div>
              </div>

              {/* Job Title */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-3 sm:p-4 relative">
                {/* <button 
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("job-details")}
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button> */}
                <div className="text-xs sm:text-sm font-medium text-black mb-2 text-left pr-8">
                  Job Title
                </div>
                <div className="flex items-center gap-2">
                  <NotebookPen className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-black">
                    {job.title}
                  </span>
                </div>
              </div>

              {/* Budget Range */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-3 sm:p-4 relative">
                {/* <button 
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/job-details")}
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button> */}
                <div className="text-xs sm:text-sm font-medium text-black mb-2 text-left pr-8">
                  Budget Range (GH₵)
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-black">
                    {`${job.min_budget} - ${job.max_budget}`}
                  </span>
                </div>
              </div>

              {/* job Description */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-3 sm:p-4 relative">
                {/* <button 
                  className="absolute top-2 sm:top-2 right-3 sm:right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/job-details")}
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button> */}
                <div className="text-xs sm:text-sm font-medium text-black mb-2 text-left pr-8">
                  Job Description
                </div>
                <p className="text-xs sm:text-sm text-gray-500 pr-6 sm:pr-8 text-left leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Project Media */}
              <div className="bg-[#fff7e7] border border-[#d4caca] rounded-lg p-3 sm:p-4 relative">
                {/* <button 
                  className="absolute top-2 sm:top-2 right-3 sm:right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => router.push("/job-details")}
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button> */}
                <div className="text-xs sm:text-sm font-medium text-black mb-2 text-left pr-8">
                  Project Media
                </div>
                <div className="flex gap-2 flex-wrap">
                  {job.uploaded_files && job.uploaded_files.length > 0 ? (
                    job.uploaded_files.map((link: string, index: number) => (
                      <div
                        key={index}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded flex items-center justify-center overflow-hidden"
                      >
                        <Image
                          src={link}
                          width={20}
                          height={20}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No media uploaded</p>
                  )}
                </div>
              </div>
            </div>
            {/* <div>
              <button
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700"
                onClick={() => router.push("/job-details")}
              >
                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div> */}
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() =>
                  router.push(`/job-details/${job.provider_id}?jobId=${job.id}`)
                }
                className="bg-[#fe9f2b] hover:bg-[#e8912a] text-white h-10 px-8 rounded border-2 border-[#c26e09] text-[12.6px] font-black"
              >
                Edit
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-[#fe9f2b] hover:bg-[#e8912a] text-white h-10 px-8 rounded border-2 border-[#c26e09] text-[12.6px] font-black"
              >
                Confirm and Book
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
