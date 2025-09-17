"use client";

import { useState, useEffect } from "react";
import { MapPin, Headphones, X, ChevronRight, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { useSession } from "@/context/SessionProvider";
import JobMedia from "@/components/JobMedia";
import { useRouter } from "next/navigation";

export default function JobInfoPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);
  const { session } = useSession();

  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    if (!job) return;

    const fetchUserAndProvider = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", job.client_id)
          .single();

        if (userError) console.error("Error fetching user:", userError.message);
        else setUser(userData);

        const { data: providerData, error: providerError } = await supabase
          .from("service_providers")
          .select("*")
          .eq("id", job.provider_id)
          .single();

        if (providerError)
          console.error("Error fetching provider:", providerError.message);
        else setProvider(providerData);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchUserAndProvider();
  }, [job]);

  const userType = session?.user?.user_metadata.userType;

  useEffect(() => {
    if (!job) return; // don't start timer until job is loaded

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCountdownComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // cleanup on unmount
  }, [job]);

  useEffect(() => {
    const fetchJobAndClient = async () => {
      setLoading(true);

      // Fetch the job
      const { data: jobData, error: jobError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", jobId)
        .single();

      if (jobError) {
        setError(jobError.message);
        setLoading(false);
        return;
      }

      setJob(jobData);

      setLoading(false);
    };

    if (jobId) fetchJobAndClient();
  }, [jobId]);

  if (loading) return <p>Loading job profile...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!job) return <p>No job found</p>;

  const updateJobStatus = async (status: "active" | "declined") => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .update({ status })
        .eq("id", jobId)
        .select()
        .single();

      if (error) {
        console.error(`Error updating job to ${status}:`, error);
        alert(`Failed to mark job as ${status}. Please try again.`);
        return;
      }

      console.log(`Job ${status}:`, data);

      // Refresh UI so status updates immediately
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // console.log(job);

  const handleCancelProject = () => {
    // Handle cancel project functionality
    console.log("Cancel job");
    setIsModalOpen(false);
  };

  const handleGetHelp = () => {
    // Handle get help functionality
    console.log("Get help");
    setIsModalOpen(false);
  };

  const handleNudgeArtisan = () => {
    // Handle nudge artisan functionality
    console.log("Nudging artisan");
    // Reset timer if needed or implement nudge logic
  };

  // Countdown effect

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <AuthenticatedNavbar />

      <div className="bg-[#faf0df] h-[290px] overflow-hidden rounded-br-[200px] relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 mt-2">
          <Button
            onClick={() =>
              router.push(
                userType === "client" ? "/landing-page" : "/dashboard"
              )
            }
            className="bg-white text-black border-2 border-black-500 hover:bg-gray-50 h-[40px] px-4 rounded-full text-[14px] font-bold"
          >
            &larr;
          </Button>
        </div>
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 h-full flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-[28px] sm:text-[36px] lg:text-[46px] font-bold text-black tracking-[-1.1px] leading-tight mb-4 lg:mb-8">
              {job.title}
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-8 mb-4 lg:mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-[#757575]" />
                <span className="text-[14px] sm:text-[16px] text-[#282827]">
                  {job.location}
                </span>
              </div>
              <div className="hidden sm:block w-[7px] h-[7px] bg-black rounded-full" />
              <div className="flex items-center gap-3">
                <Headphones className="w-6 h-6 text-[#757575]" />
                <span className="text-[14px] sm:text-[16px] text-[#282827]">
                  {`Job ID #${job.id.split("-")[0]}`}
                </span>
              </div>
              <div className="hidden sm:block w-[7px] h-[7px] bg-black rounded-full" />
              <div className="flex items-center gap-3">
                <span className="text-[14px] sm:text-[16px] text-[#282827]">
                  {`Status: ${job.status}`}
                </span>
              </div>
            </div>

            {userType === "client" ? (
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-black border-2 border-[#757575] hover:bg-gray-50 h-[52px] px-9 rounded-[5px] text-[16px] font-bold">
                    Manage Job
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-[24px] font-bold text-black">
                      Manage Job
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Cancel project */}
                    <button
                      onClick={handleCancelProject}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 border-b border-gray-200"
                    >
                      <span className="text-[16px] text-gray-700">
                        Cancel job
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Get help */}
                    <button
                      onClick={handleGetHelp}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                    >
                      <span className="text-[16px] text-gray-700">
                        Get help
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              job.status === "pending" && (
                <div className="space-x-2">
                  <Button
                    onClick={() => updateJobStatus("active")}
                    className="bg-[#fe9f2b] hover:bg-[#e8912a] text-white h-10 px-8 rounded border-2 border-[#c26e09] text-[12.6px] font-black"
                  >
                    Accept Job
                  </Button>
                  <Button
                    onClick={() => updateJobStatus("declined")}
                    className="bg-[#fe9f2b] hover:bg-[#e8912a] text-white h-10 px-8 rounded border-2 border-[#c26e09] text-[12.6px] font-black"
                  >
                    Decline Job
                  </Button>
                </div>
              )
            )}
          </div>

          <div className="w-[200px] h-[200px] lg:w-[250px] lg:h-[250px] mt-6 lg:mt-0">
            <div
              className="w-full h-full bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: "url('/images/toolbox.png')" }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1">
            <h2 className="text-[18px] lg:text-[20px] font-bold text-black mb-4 lg:mb-6">
              Job details
            </h2>

            <Card className="rounded-[8px] overflow-hidden">
              <CardContent className="p-4 lg:p-6 space-y-4 lg:space-y-5">
                <div>
                  <p className="text-[14px] lg:text-[16px] text-black leading-[20px] lg:leading-[24px] mb-0">
                    Service Category:
                  </p>
                  <p className="text-[14px] lg:text-[16px] font-bold text-black leading-[20px] lg:leading-[24px]">
                    {job.service_category}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] lg:text-[16px] text-black leading-[20px] lg:leading-[24px] mb-0">
                    Service Type:
                  </p>
                  <p className="text-[14px] lg:text-[16px] font-bold text-black leading-[20px] lg:leading-[24px]">
                    {job.service_type}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] lg:text-[16px] text-black leading-[20px] lg:leading-[24px] mb-0">
                    Preferred Start Date & Time:
                  </p>
                  <p className="text-[14px] lg:text-[16px] font-bold text-black leading-[20px] lg:leading-[24px]">
                    {new Date(job.date[0]).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] lg:text-[16px] text-black leading-[20px] lg:leading-[24px] mb-0">
                    Budget Range:
                  </p>
                  <p className="text-[14px] lg:text-[16px] font-bold text-black leading-[20px] lg:leading-[24px]">
                    {`GHC ${job.min_budget} - ${job.max_budget}`}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] lg:text-[16px] text-black leading-[20px] lg:leading-[24px] mb-3">
                    Job Description:
                  </p>
                  <p className="text-[14px] lg:text-[16px] font-bold text-black leading-[20px] lg:leading-[24px] mb-3">
                    {job.description}
                  </p>
                </div>

                <div>
                  <JobMedia uploaded_files={job.uploaded_files} />
                </div>
              </CardContent>
            </Card>
          </div>
          {userType == "client" && provider && (
            <div className="w-full lg:w-[320px] mt-14">
              <Card className="rounded-[8px] lg:top-4">
                <CardContent className="p-6">
                  <h3 className="text-[16px] lg:text-[18px] font-bold text-black text-center mb-4 leading-tight">
                    {provider?.full_name} has been booked for your job.
                  </h3>
                  <p className="text-center m-2">
                    Check back in{" "}
                    <span className="text-[#fe9f2b]">
                      {`${formatTime(timeLeft)} `}
                    </span>
                    for a response.{" "}
                    <span className=" text-center ">
                      If they haven't responded by then, you can nudge them.
                    </span>
                  </p>

                  <div className="flex justify-center gap-1 mb-3">
                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                      <img
                        src="/images/pic1.png"
                        alt="Artisan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <p className="text-[14px] font-semibold text-black text-center mb-2">
                    {provider?.full_name}
                  </p>

                  <p className="text-[14px] text-black text-center mb-6">
                    {provider?.full_name} is a great fit for your job
                  </p>
                  {/* Features List */}
                  <div className="space-y-4 mb-8 flex flex-col items-center">
                    <div className="flex items-center gap-3">
                      <CheckIcon className="w-3 h-3 text-green-500" />
                      <span className="text-[12px] text-black">
                        Vetted Professionals
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckIcon className="w-3 h-3 text-green-500" />
                      <span className="text-[12px] text-black">
                        Fast Response Time
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon className="w-3 h-3 text-green-500" />
                      <span className="text-[12px] text-black">
                        Trusted by Houseowners
                      </span>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  {!isCountdownComplete && (
                    <div className="text-center mb-4">
                      <p className="text-[12px] text-gray-600 mb-2">
                        Waiting for artisan response
                      </p>
                      <div className="text-[18px] font-bold text-[#fe9f2b]">
                        {formatTime(timeLeft)}
                      </div>
                    </div>
                  )}

                  {isCountdownComplete && (
                    <div className="text-center mb-4">
                      <p className="text-[12px] text-red-600">
                        Artisan hasn't responded. You can now nudge them.
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={
                      isCountdownComplete ? handleNudgeArtisan : undefined
                    }
                    disabled={!isCountdownComplete}
                    className={`w-full h-[44px] rounded-[5px] text-[14px] font-normal ${
                      isCountdownComplete
                        ? "bg-[#fe9f2b] hover:bg-[#e8912a] text-white cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isCountdownComplete
                      ? "Nudge Artisan"
                      : "Waiting for Response"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
