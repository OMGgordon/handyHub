"use client";
import { Navbar } from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useSession } from "@/context/SessionProvider";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import ProjectComponent from "@/components/Project";

type Project = {
  id: string;
  title: string;
  description: string;
  status: string;
  client_id: string;
  provider_id: string;
  created_at: string;
};

function ProjectPage() {
  const { session } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = session?.user?.user_metadata?.fullName?.split(" ")[0];

  const handleStartProject = () => {
    router.push("/Post-project");
  };

  useEffect(() => {
    const fetchProjects = async () => {
      if (!session?.user?.id) return;

      setLoading(true);
      const { data, error } = await supabase.from("projects").select("*");
      //.eq("client_id", session.user.id);

      if (error) {
        console.error("Error fetching projects:", error.message);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [session, supabase]);

  return (
    <div>
      <Navbar />

      <div className="px-16 py-6 space-y-4">
        <h1 className="font-segoe text-3xl font-extrabold">
          {firstName ? `${firstName}'s projects` : "Your Projects"}
        </h1>
        <Separator />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p>Loading...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
          <Image
            src={"/noProjects.png"}
            width={100}
            height={100}
            alt="no projects found"
          />
          <span className="font-semibold">You dont have any projects yet</span>
          <span>When you do you will find them here</span>
          <Button onClick={handleStartProject}>Start a project</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectComponent key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectPage;
