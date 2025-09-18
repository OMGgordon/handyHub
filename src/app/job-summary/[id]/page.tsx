"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  CheckCircle,
  Timer,
  Eye,
  Home,
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

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

  // Timer effect - countdown from 20 minutes (1200 seconds)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!job) return <p>No job found</p>;

  console.log(job);

  const projectDetails = {
    location: "East legon, Accra",
    serviceType: "Repair",
    serviceCategory: "Plumbing",
    jobTitle: "Fix leaking sink",
    description:
      "Hi! Looking for help updating my 650 sq ft apartment. I&apos;m on the 2nd floor up a short flight of stairs. Please bring an electric drill and ring doorbell number 3. Thanks!",
    startDate: "August 15, 2025 | 3:00 PM",
    budget: "2,500 - 4,000",
    images: 3,
  };

  const handleBack = () => {
    router.push("/Post-project/date-budget");
  };

  const handleConfirm = () => {
    // Start the 20-minute countdown timer (1200 seconds)
    setTimeRemaining(1200); // 20 minutes = 1200 seconds
    setTimerActive(true);
    // Show success modal
    setShowSuccessModal(true);
  };

  const handleGoToLanding = () => {
    router.push("/landing-page");
  };

  const handleViewJobInfo = () => {
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
                <p className="text-xs sm:text-sm font-bold text-black pr-6 sm:pr-8 text-left leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Job Media */}
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
                  router.push(
                    `/job-details/${job.provider_id}?jobId=${job.id}&isEditing=true`
                  )
                }
                variant="outline"
                className="bg-white text-[#fe9f2b] border-2 border-[#fe9f2b] hover:bg-[#fe9f2b] hover:text-white h-10 w-full sm:w-40 rounded text-[12.6px] font-black"
              >
                Edit
              </Button>

              <Button
                onClick={handleConfirm}
                className="bg-[#fe9f2b] hover:bg-[#e8912a] text-white h-10 w-full sm:w-40 rounded border-2 border-[#c26e09] text-[12.6px] font-black"
              >
                Confirm and Book
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal}>
        <DialogContent className="sm:max-w-sm" showCloseButton={false}>
          <DialogHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900">
              Booking Request Sent!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-center">
            <p className="text-sm text-gray-600">
              Your booking request has been sent to the handyman. They will
              review your request and respond shortly.
            </p>

            {/* Response countdown info */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800 text-sm">
                  Response Timer
                </span>
              </div>

              {timeRemaining !== null && timeRemaining > 0 ? (
                <div className="text-center mb-2">
                  <div className="text-xl font-bold text-orange-800 mb-1">
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-xs text-orange-700">
                    Time remaining for response
                  </p>
                </div>
              ) : timeRemaining === 0 ? (
                <div className="text-center mb-2">
                  <div className="text-base font-bold text-red-600 mb-1">
                    Time&apos;s Up!
                  </div>
                  <p className="text-xs text-red-700">
                    You can now <strong>"Nudge Artisan"</strong>
                  </p>
                </div>
              ) : null}

              <p className="text-xs text-orange-700 text-center">
                The handyman has <strong>20 minutes</strong> to respond. You can{" "}
                <strong>"Nudge Artisan"</strong> if you dont get a response
                after {formatTime(timeRemaining ?? 0)}.
              </p>
            </div>

            {/* Job info access */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 text-sm">
                  Manage Your Booking
                </span>
              </div>
              <p className="text-xs text-blue-700">
                View booking details and communicate with the artisan from your
                Projects page.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3">
              <Button
                onClick={handleViewJobInfo}
                variant="outline"
                className="flex-1 border-[#fe9f2b] text-[#fe9f2b] hover:bg-[#fe9f2b] hover:text-white text-sm h-9"
              >
                <Eye className="h-3 w-3 mr-1" />
                View Job Details
              </Button>
              <Button
                onClick={handleGoToLanding}
                className="flex-1 bg-[#fe9f2b] hover:bg-[#e8912a] text-white text-sm h-9"
              >
                <Home className="h-3 w-3 mr-1" />
                Back to Home
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
