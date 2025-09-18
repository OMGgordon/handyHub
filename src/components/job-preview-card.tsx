"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  client_id: string;
  provider_id: string;
  status: string;
  service_category: string;
  service_type: string;
  location: string;
  uploaded_files: string[];
  min_budget: number;
  max_budget: number;
  created_at: string;
  date: string[]; // adjust if this is really an array of timestamps
}

interface JobPreviewCardProps {
  recentJob: Project;
}

export function JobPreviewCard({ recentJob }: JobPreviewCardProps) {
  // const [recentJobs, setRecentJobs] = useState<Project[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchRecentJob = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     console.log(user);

  //     if (user) {
  //       const { data, error } = await supabase
  //         .from("projects")
  //         .select("*")
  //         .eq("provider_id", user.id)
  //         .eq("status", "active")
  //         .order("created_at", { ascending: false });
  //       // .limit(1)
  //       // .single(); // since we want just one job

  //       console.log(data, "data");

  //       if (error) {
  //         console.error("Error fetching recent job:", error);
  //       } else {
  //         setRecentJobs(data || []);
  //       }
  //     }
  //   };

  //   fetchRecentJob();
  // }, [providerId]);

  // console.log(recentJobs, "jpnbs");

  // if (loading) return <p>Loading recent job...</p>;

  // if (!recentJobs) return <p>No recent job yet.</p>;
  const router = useRouter();

  // const handleChatClient = async (
  //   clientId: string,
  //   providerId: string,
  //   projectId: string
  // ) => {
  //   // 1️⃣ Check if conversation already exists
  //   const { data: existing, error: existingError } = await supabase
  //     .from("conversations")
  //     .select("*")
  //     .eq("client_id", clientId)
  //     .eq("provider_id", providerId)
  //     .eq("project_id", projectId)
  //     .single();

  //   if (existingError && existingError.code !== "PGRST116") {
  //     console.error(existingError);
  //     return;
  //   }

  //   let conversationId = existing?.id;

  //   // 2️⃣ If not, create new conversation
  //   if (!conversationId) {
  //     const { data, error } = await supabase
  //       .from("conversations")
  //       .insert({
  //         client_id: clientId,
  //         provider_id: providerId,
  //         project_id: projectId,
  //         provider_name: "Provider Name", // preload for inbox sidebar
  //         provider_avatar: "/avatar.png",
  //         project_title: recentJob?.title,
  //       })
  //       .select()
  //       .single();

  //     if (error) {
  //       console.error(error);
  //       return;
  //     }

  //     conversationId = data.id;
  //   }

  //   // 3️⃣ Redirect to inbox and open conversation
  //   router.push(`/inbox?conversation=${conversationId}`);
  // };

  const startConversation = async (
    clientId: string,
    providerId: string,
    projectId: string,
    providerName?: string,
    providerAvatar?: string
  ) => {
    // 1. Check if conversation exists
    const { data: existing, error: checkError } = await supabase
      .from("conversations")
      .select("*")
      .eq("client_id", clientId)
      .eq("provider_id", providerId)
      .eq("project_id", projectId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking conversation:", checkError);
      return null;
    }

    if (existing) {
      return existing; // reuse existing conversation
    }

    // 2. If not, create new conversation
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        client_id: clientId,
        provider_id: providerId,
        provider_name: providerName,
        provider_avatar: providerAvatar || null,
        project_id: projectId,
        last_message: "",
        rating: 0,
        review_count: 0,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      return null;
    }

    return data;
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Accepted Job
      </h3>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <h4 className="text-xl font-bold text-gray-900">
            {recentJob?.title}
          </h4>

          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="font-medium text-gray-600 w-24">Client ID:</span>
              <span className="text-gray-900">
                {recentJob?.client_id.split("-")[0]}...
              </span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-600 w-24">Location:</span>
              <span className="text-gray-900">{recentJob?.location}</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-600 w-24">Date:</span>
              <span className="text-gray-900">
                {/* {recentJob.date?.[0] || "N/A"} */}
                {(recentJob &&
                  recentJob.date &&
                  format(new Date(recentJob?.date?.[0]), "MMM d, yyyy")) ||
                  "N/A"}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-600 w-24">Budget:</span>
              <span className="text-gray-900">
                GHC {recentJob?.min_budget} - {recentJob?.max_budget}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => router.push(`/job-info/${recentJob?.id}`)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            >
              VIEW JOB
            </Button>
            <Button
              onClick={async () => {
                const conversation = await startConversation(
                  recentJob.client_id, // from supabase.auth.user()?.id
                  recentJob.provider_id, // e.g. from the project/provider profile
                  recentJob.id
                  // providerName,
                  // providerAvatar
                );

                if (conversation) {
                  router.push(`/inbox?conversationId=${conversation.id}`);
                }
              }}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50 px-6 bg-transparent"
            >
              CHAT CUSTOMER
            </Button>
          </div>
        </div>

        <div className="lg:w-48">
          <Image
            width={50}
            height={50}
            src={recentJob?.uploaded_files?.[0] || "/images/Handyperson.png"}
            alt="Job preview"
            className="w-full h-48 lg:h-40 object-cover rounded-lg"
          />
        </div>
      </div>
    </Card>
  );
}
