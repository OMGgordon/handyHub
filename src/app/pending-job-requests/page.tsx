"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";
import { format } from "date-fns";

interface JobRequest {
  id: string;
  title: string;
  iconImage: string;
  clientName: string;
  location: string;
  date: string;
  time: string;
  budgetRange: string;
}


export default function PendingJobRequestsPage({ jobs }: { jobs?: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("bookings");

  const handleViewJob = (jobId: string) => {
    router.push(`/job-info/${jobId}`);
  };

  const jobRequests = jobs ?? [];

  // const jobRequests: JobRequest[] = [
  //   {
  //     id: "1",
  //     title: "Installing New Heater",
  //     iconImage: "/images/HVAC.png",
  //     clientName: "Julia Osei",
  //     location: "Cantoment, 1st Oxford Street",
  //     date: "19th September, 2025",
  //     time: "3:00pm",
  //     budgetRange: "GHS 300 - GHS 700"
  //   },
  //   {
  //     id: "2",
  //     title: "Electrical Rewiring",
  //     iconImage: "/images/Electrical.png",
  //     clientName: "Julia Osei",
  //     location: "Cantoment, 1st Oxford Street",
  //     date: "19th September, 2025",
  //     time: "3:00pm",
  //     budgetRange: "GHS 300 - GHS 700"
  //   },
  //   {
  //     id: "3",
  //     title: "Painting 2 Rooms",
  //     iconImage: "/images/Painting.png",
  //     clientName: "Julia Osei",
  //     location: "Cantoment, 1st Oxford Street",
  //     date: "19th September, 2025",
  //     time: "3:00pm",
  //     budgetRange: "GHS 300 - GHS 700"
  //   }
  // ];

  return (
    <div className="min-h-screen bg-[#fff7e7]">
      {/* Navbar */}
      <AuthenticatedNavbar />

      <div className="max-w-7xl mx-auto px-12 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-[30px] font-bold text-black mb-2">
            Pending Job Requests
          </h1>
          <p className="text-[15px] text-[#757575]">
            Review and respond to new job opportunities.
          </p>
        </div>

        {/* Job Request Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {jobRequests.map((job) => (
            <Card
              key={job.id}
              className="bg-white rounded-[10px] overflow-hidden min-h-[328px]"
            >
              <CardContent className="px-6 py-4 h-full flex flex-col">
                {/* Job Title with Icon */}
                <div className="flex items-center gap-4 mb-4">
                  {job?.uploaded_files &&
                    job?.uploaded_files.map((file, index) => (
                      <Image
                        key={index}
                        src={file}
                        alt={job.title}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ))}
                  <h3 className="text-[15px] font-bold text-black">
                    {job.title}
                  </h3>
                </div>

                {/* Job Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex justify-between">
                    <span className="text-[15px] font-bold text-black">
                      Client Name:
                    </span>
                    <span className="text-[15px] text-black">
                      {job.clientName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[15px] font-bold text-black">
                      Location:
                    </span>
                    <span className="text-[15px] text-black">
                      {job.location}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[15px] font-bold text-black">
                      Date:
                    </span>
                    <span className="text-[15px] text-black">
                      {format(new Date(job.date[0]), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[15px] font-bold text-black">
                      Time:
                    </span>
                    <span className="text-[15px] text-black">{job.time}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[15px] font-bold text-black">
                      Budget Range:
                    </span>
                    <span className="text-[15px] text-black">
                      {`${job.min_budget} - ${job.max_budget}`}
                    </span>
                  </div>
                </div>

                {/* View Job Button */}
                <div className="flex justify-center mt-10">
                  <Button
                    onClick={() => handleViewJob(job.id)}
                    className="bg-[#fe9f2b] hover:bg-[#e8912a] text-white px-8 py-2 rounded-[10px] text-[15px] font-bold"
                  >
                    VIEW JOB
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
