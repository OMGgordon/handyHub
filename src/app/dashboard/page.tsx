"use client";

import Image from "next/image";
import { StatCard } from "@/components/stat-card";
import { JobPreviewCard } from "@/components/job-preview-card";
import { QuickActions } from "@/components/quick-actions";
import { RecentReviews } from "@/components/recent-reviews";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";
import { useSession } from "@/context/SessionProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export type ServiceProvider = {
  id: string; // uuid
  user_id: string; // uuid
  full_name: string | null;
  service_category: string[]; // text[]
  price: number | null; // numeric
  rating: number | null; // numeric
  review_count: number | null; // integer
  verified: boolean;
  completed_projects: number | null;
  bio: string | null;
  avatar: string | null;
  location: string | null;
  availability: string[]; // text[]
  timeslots: string[]; // text[]
  inserted_at: string; // timestamp with time zone
  updated_at: string; // timestamp with time zone
  phone_number: string | null;
  experience: string | null;
  uploaded_files: string[]; // text[]
  services: string[]; // text[]
  amenities: Record<string, any> | null; // jsonb
  payment_methods: string[]; // text[]
  photos: string[]; // text[]
};
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

type DashboardProps = {
  provider: ServiceProvider;
};

export default function Dashboard() {
  const { session, loading } = useSession();
  const userType = session?.user?.user_metadata?.userType;
  const userId = session?.user?.id;
  const router = useRouter();

  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [recentJobs, setRecentJobs] = useState<Project[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log(user);

      if (user) {
        const { data, error } = await supabase
          .from("service_providers")
          .select("*")
          .eq("id", user.id)
          .single();

        console.log(data);

        if (error) console.error(error);
        else setProvider(data);
      }
    };

    const fetchRecentJob = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log(user);

      if (user) {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("provider_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false });
        // .limit(1)
        // .single(); // since we want just one job

        console.log(data, "data");

        if (error) {
          console.error("Error fetching recent job:", error);
        } else {
          setRecentJobs(data || []);
        }
      }
    };

    fetchProvider();
    fetchRecentJob();
  }, []); // ✅ run once

  if (loading) return <div>Loading session...</div>;
  console.log("prov", provider);
  console.log("jobs", recentJobs);

  return (
    <div className="min-h-screen bg-[#FFF7E7]">
      <AuthenticatedNavbar />
      {/* <HandyHiveNavbar /> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {provider?.full_name}! Here&apos;s your business
            overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Jobs Completed"
            value={recentJobs.length}
            // change="10% vs last month"
            changeType="positive"
            icon={
              <Image
                src="/Mask group.png"
                alt=""
                width={80}
                height={80}
                className="w-26 h-26 object-contain"
              />
            }
            // iconBg="bg-green-400"
          />
          <StatCard
            title="Accepted Jobs"
            value={recentJobs?.length || 0}
            icon={
              <Image
                src="/mdi_toolbox.png"
                alt=""
                width={80}
                height={80}
                className="w-26 h-26 object-contain"
              />
            }
          />
          <StatCard
            title="Average Ratings"
            value={provider?.rating}
            // change="No Change"
            changeType="neutral"
            icon={
              <Image
                src="/star.png"
                alt=""
                width={80}
                height={80}
                className="w-26 h-26 object-contain"
              />
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Preview */}
          <div className="lg:col-span-2">
            {provider?.id ? (
              <JobPreviewCard
                recentJob={recentJobs[0]}
                title="Installing New Heater"
                clientName="Julia Osei"
                location="Cantoment, 1st Oxford Street"
                date="19th September, 2025"
                time="3:00pm"
                image="/faucet.png"
              />
            ) : (
              <p>Loading recent job...</p>
            )}
          </div>

          {/* Right Column - Quick Actions */}
          <div>{provider && <QuickActions providerId={provider.id} />}</div>
        </div>

        {/* Recent Reviews */}
        <div className="mt-8">
          {provider?.id ? (
            <RecentReviews providerId={provider.id} />
          ) : (
            <p>Loading reviews...</p>
          )}
        </div>
      </main>
    </div>
  );
}
