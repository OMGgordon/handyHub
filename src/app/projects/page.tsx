"use client";
import { Navbar } from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useSession } from "@/context/SessionProvider";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import ProjectComponent from "@/components/Project";
import { format } from "date-fns";
import { useUserContext } from "@/context/UserContext";

type Project = {
  date: any;
  max_budget: any;
  min_budget: any;
  id: string;
  title: string;
  description: string;
  status: string;
  client_id: string;
  provider_id: string;
  created_at: string;
};

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

function ProjectPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"client" | "provider" | null>(null);
  const [activeTab, setActiveTab] = useState("in-progress");
  const [client, setClient] = useState<any>(null)

  const { session } = useSession();
  const userType = session?.user?.user_metadata.userType;

  const firstName = session?.user?.user_metadata?.fullName?.split(" ")[0];

  const handleStartProject = () => {
    router.push("/Post-project");
  };

  const handleViewJob = (jobId: string) => {
    router.push(`/job-info/${jobId}`);
  };

  // Mock data for pending job requests
  // const jobRequests: JobRequest[] = [
  //   {
  //     id: "1",
  //     title: "Installing New Heater",
  //     iconImage: "/images/HVAC.png",
  //     clientName: "Julia Osei",
  //     location: "Cantoment, 1st Oxford Street",
  //     date: "19th September, 2025",
  //     time: "3:00pm",
  //     budgetRange: "GHS 300 - GHS 700",
  //   },
  //   {
  //     id: "2",
  //     title: "Electrical Rewiring",
  //     iconImage: "/images/Electrical.png",
  //     clientName: "Julia Osei",
  //     location: "Cantoment, 1st Oxford Street",
  //     date: "19th September, 2025",
  //     time: "3:00pm",
  //     budgetRange: "GHS 300 - GHS 700",
  //   },
  //   {
  //     id: "3",
  //     title: "Painting 2 Rooms",
  //     iconImage: "/images/Painting.png",
  //     clientName: "Julia Osei",
  //     location: "Cantoment, 1st Oxford Street",
  //     date: "19th September, 2025",
  //     time: "3:00pm",
  //     budgetRange: "GHS 300 - GHS 700",
  //   },
  // ];

  const jobRequests = projects.filter((p) => p.status === "pending");

  // Filter projects based on status and tab
  const filterProjectsByStatus = (tab: string) => {
    if (tab === "in-progress") {
      return projects.filter((p) =>
        ["in_progress", "active", "ongoing"].includes(p.status)
      );
    }
    if (tab === "done") {
      return projects.filter((p) =>
        ["done", "completed", "finished"].includes(p.status)
      );
    }
    if (tab === "pending") {
      return projects.filter((p) => p.status === "pending");
    }
    if (tab === "declined") {
      return projects.filter((p) => p.status === "declined");
    }
    return [];
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user?.id) return;

      console.log("Checking user role for ID:", session.user.id);

      // Check if user is a service provider
      // First try querying by id (which is set to userId in signup)
      const { data: providerData, error } = await supabase
        .from("service_providers")
        .select("id")
        .eq("id", session.user.id)
        .single();

      console.log("Provider data (by id):", providerData);
      console.log("Provider query error (by id):", error);

      let role: "client" | "provider" = "client";

      if (providerData && !error) {
        role = "provider";
      } else if (error && error.code !== "PGRST116") {
        console.error("Unexpected error checking provider status:", error);
      }

      console.log("Setting user role to:", role);
      setUserRole(role);
    };
  });
  //   fetchUserRole();
  // }, [session]);
  const fetchProjects = async () => {
    if (!session?.user?.id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .or(`client_id.eq.${session.user.id},provider_id.eq.${session.user.id}`);

    if (error) {
      console.error("Error fetching projects:", error.message);
    } else {
      setProjects(data || []);
    }

    setLoading(false);
  };

  // initial fetch
  useEffect(() => {
    fetchProjects();
  }, [session]);


  const { getClientById, getProviderById } = useUserContext();
  
  
  

  // realtime subscription
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel("projects-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        (payload) => {
          console.log("Realtime change:", payload);
          fetchProjects(); // re-fetch projects on change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  console.log(projects, loading);
  console.log(jobRequests, "Jobrequests");

  const renderProjectsForTab = (status: string) => {
    const filteredProjects = filterProjectsByStatus(status);

    if (filteredProjects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-2">
          <Image
            src={"/noProjects.png"}
            width={100}
            height={100}
            alt="no projects found"
          />
          <span className="font-semibold">
            No {status.replace("-", " ")} jobs
          </span>
          <span>Jobs with this status will appear here</span>
        </div>
      );
    }

    return (
      <div className="space-y-4 px-24">
        {filteredProjects.map((project) => (
          <ProjectComponent key={project.id} project={project} />
        ))}
      </div>
    );
  };

  const renderPendingJobRequests = () => {
    if (jobRequests.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-2">
          <Image
            src={"/noProjects.png"}
            width={100}
            height={100}
            alt="no pending job requests"
          />
          <span className="font-semibold">No pending job requests</span>
          <span>New job opportunities will appear here</span>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {jobRequests.map((job) => {
          // const client = getClientById(job.client_id); // ✅ resolve client per job
          // console.log(client)
          return (
            <Card
              key={job.id}
              className="bg-white rounded-[10px] overflow-hidden min-h-[328px]"
            >
              <CardContent className="px-6 py-4 h-full flex flex-col">
                {/* Job Title with Icon */}
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={job.iconImage}
                    alt={job.title}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                  <h3 className="text-[15px] font-bold text-black">
                    {job.title}
                  </h3>
                </div>

                {/* Job Details */}
                <div className="space-y-3 flex-1">
                  {/* <div className="flex justify-between">
                    <span className="text-[15px] font-bold text-black">
                      Client Name:
                    </span>
                    <span className="text-[15px] text-black">
                      {client?.full_name || "Unknown"}
                    </span>
                  </div> */}

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
                      Preferred Start Date:
                    </span>
                    <span className="text-[15px] text-black">
                      {format(new Date(job.date[0]), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[15px] font-bold text-black">
                      Preferred Start Time:
                    </span>
                    <span className="text-[15px] text-black">
                      {format(new Date(job.date[0]), "h:mm a")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[15px] font-bold text-black">
                      Budget Range:
                    </span>
                    <span className="text-[15px] text-black">
                      {`GHC ${job.min_budget} - ${job.max_budget}`}
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
          );
        })}
      </div>

      // <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      //   {jobRequests.map((job) => (
      //     <Card
      //       key={job.id}
      //       className="bg-white rounded-[10px] overflow-hidden min-h-[328px]"
      //     >
      //       <CardContent className="px-6 py-4 h-full flex flex-col">
      //         {/* Job Title with Icon */}
      //         <div className="flex items-center gap-4 mb-4">
      //           <Image
      //             src={job.iconImage}
      //             alt={job.title}
      //             width={48}
      //             height={48}
      //             className="object-contain"
      //           />
      //           <h3 className="text-[15px] font-bold text-black">
      //             {job.title}
      //           </h3>
      //         </div>

      //         {/* Job Details */}
      //         <div className="space-y-3 flex-1">
      //           <div className="flex justify-between">
      //             <span className="text-[15px] font-bold text-black">
      //               Client Name:
      //             </span>
      //             <span className="text-[15px] text-black">
      //               {job.client?.full_name || "Unknown"}
      //             </span>
      //           </div>

      //           <div className="flex justify-between">
      //             <span className="text-[15px] font-bold text-black">
      //               Location:
      //             </span>
      //             <span className="text-[15px] text-black">{job.location}</span>
      //           </div>

      //           <div className="flex justify-between">
      //             <span className="text-[15px] font-bold text-black">
      //               Preferred Start Date:
      //             </span>
      //             <span className="text-[15px] text-black">
      //               {format(new Date(job.date[0]), "MMM d, yyyy")}
      //             </span>
      //           </div>

      //           <div className="flex justify-between">
      //             <span className="text-[15px] font-bold text-black">
      //               Preffered Start Time:
      //             </span>
      //             <span className="text-[15px] text-black">
      //               {format(new Date(job.date[0]), "h:mm a")}
      //             </span>
      //           </div>

      //           <div className="flex justify-between">
      //             <span className="text-[15px] font-bold text-black">
      //               Budget Range:
      //             </span>
      //             <span className="text-[15px] text-black">
      //               {`GHC ${job.min_budget} - ${job.max_budget}`}
      //             </span>
      //           </div>
      //         </div>

      //         {/* View Job Button */}
      //         <div className="flex justify-center mt-10">
      //           <Button
      //             onClick={() => handleViewJob(job.id)}
      //             className="bg-[#fe9f2b] hover:bg-[#e8912a] text-white px-8 py-2 rounded-[10px] text-[15px] font-bold"
      //           >
      //             VIEW JOB
      //           </Button>
      //         </div>
      //       </CardContent>
      //     </Card>
      //   ))}
      // </div>
    );
  };

  return (
    <div>
      <Navbar />

      <div className="px-24 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-segoe text-4xl font-extrabold">
              {firstName ? `${firstName}'s projects` : "Your Jobs"}
            </h1>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
              <Image
                src={"/noProjects.png"}
                width={100}
                height={100}
                alt="no projects found"
              />
              <span className="font-semibold">You dont have any jobs yet</span>
              <span>When you do you will find them here</span>
            </div>
          ) : (
            <div className="px-24">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="bg-transparent h-auto p-0 space-x-0">
                  <TabsTrigger
                    value="in-progress"
                    className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-black rounded-none px-4 pb-2 mr-20 text-base font-bold text-gray-600 data-[state=active]:text-black"
                  >
                    Jobs In Progress
                  </TabsTrigger>
                  <TabsTrigger
                    value="done"
                    className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-black rounded-none px-8 pb-2 mx-10 text-base font-bold text-gray-600 data-[state=active]:text-black"
                  >
                    Done Jobs
                  </TabsTrigger>
                  <TabsTrigger
                    value="declined"
                    className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-black rounded-none px-8 pb-2 mx-10 text-base font-bold text-gray-600 data-[state=active]:text-black"
                  >
                    Declined Jobs
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-black rounded-none px-0 pb-2 ml-10 text-base font-bold text-gray-600 data-[state=active]:text-black"
                  >
                    {userType === "client" ? "Pending Jobs" : "Job Requests"}
                  </TabsTrigger>
                </TabsList>
                <Separator />

                <TabsContent value="in-progress" className="mt-6">
                  {renderProjectsForTab("in-progress")}
                </TabsContent>

                <TabsContent value="done" className="mt-6">
                  {renderProjectsForTab("done")}
                </TabsContent>

                <TabsContent value="declined" className="mt-6">
                  {renderProjectsForTab("declined")}
                </TabsContent>

                {userType === "client" ? (
                  <TabsContent value="pending" className="mt-6">
                    {renderProjectsForTab("pending")}
                    {/* {userType === "client"
                      ? renderProjectsForTab("pending")
                      : renderPendingJobRequests()} */}
                  </TabsContent>
                ) : (
                  <TabsContent value="pending" className="mt-6">
                    {/* {renderProjectsForTab("pending")} */}
                    {renderPendingJobRequests()}
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default ProjectPage;
