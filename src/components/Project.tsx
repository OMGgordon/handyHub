import React from "react";
import Image from "next/image";

type Project = {
  id: string;
  title: string;
  description: string;
  status: string;
  client_id: string;
  provider_id: string;
  created_at: string;
};

type ProjectProps = {
  project: Project;
};

function Project({ project }: ProjectProps) {
  return (
    <div key={project.id} className="border rounded-md w-[90%] mx-auto p-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <h2>{project.title}</h2>
          <div className="flex flex-row items-center gap-2 mt-1">
            <Image
              src="/calenderCheck.png"
              width={18}
              height={10}
              alt="calender"
            />
            <p className="text-sm">
              Started on{" "}
              <span>
                {new Date(project.created_at).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        </div>
        <div>
          <Image src="/right.png" width={20} height={20} alt="calender" />
        </div>
      </div>
    </div>
  );
}

export default Project;
