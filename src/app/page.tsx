"use client";

import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { ServiceCategories } from "../components/ServicesCategories";
import { PopularProjects } from "../components/PopularProjects";
import { Footer } from "../components/Footer";
import { useSession } from "@/context/SessionProvider";
import Dashboard from "./dashboard/page";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { session } = useSession();
  const userType = session?.user?.user_metadata.userType;

  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const fetchProvider = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("service_providers")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) console.error(error);
        else setProvider(data);
      }
    };

    fetchProvider();
  }, []);

  //user.id == service_providers.user_id
  return (
    <>
      {session && userType === "provider" ? (
        // provider ? (
        //   <Dashboard />
        // ) : (
        //   <div>Loading...</div>
        // )
        <Dashboard />
      ) : (
        <div className="min-h-screen bg-white">
          <Navbar />
          <HeroSection />
          <ServiceCategories />
          {/* <PopularProjects /> */}
          <Footer />
        </div>
      )}
    </>
  );
}
