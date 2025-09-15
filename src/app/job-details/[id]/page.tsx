"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Calendar, MapPin, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";
import { useParams } from "next/navigation";
import { useProvider } from "@/context/ProviderContext";
import { supabase } from "@/lib/supabase";

interface BookServicePageProps {
  onNavigateHome: () => void;
  onNavigateToSignIn: () => void;
  onContinueToConfirmation: () => void;
  providerName?: string;
  providerService?: string;
}

export function BookServicePage() {
  const [formData, setFormData] = useState({
    serviceCategory: "",
    serviceType: "",
    dateTime: "",
    address: "",
    jobTitle: "",
    minBudget: "",
    maxBudget: "",
    description: "",
    uploadedFiles: [] as File[],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, ...Array.from(files)],
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      // ✅ Get logged in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("You need to sign in first.");
        return;
      }

      // ✅ Upload files to Supabase Storage (optional)
      const uploadedUrls: string[] = [];
      for (const file of formData.uploadedFiles) {
        const { data, error: uploadError } = await supabase.storage
          .from("uploads") // 👈 make sure you have this bucket created
          .upload(`${user.id}/${Date.now()}-${file.name}`, file);

        if (uploadError) {
          console.error(uploadError);
        } else if (data) {
          const url = supabase.storage
            .from("uploads")
            .getPublicUrl(data.path).data.publicUrl;
          uploadedUrls.push(url);
        }
      }

      // ✅ Insert into projects
      const { data, error } = await supabase.from("projects").insert([
        {
          id: crypto.randomUUID(),
          provider_id: providerId,
          client_id: user.id,
          status: "pending",
          service_category: formData.serviceCategory,
          service_type: formData.serviceType,
          title: formData.jobTitle,
          min_budget: formData.minBudget,
          max_budget: formData.maxBudget,
          description: formData.description,
          uploaded_files: uploadedUrls, // ✅ store file URLs, not File objects
        },
      ]);

      if (error) {
        console.error(error);
        alert("Failed to create project.");
      } else {
        console.log("Project created:", data);
        alert("Project submitted successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const params = useParams();
  const providerId = params.id as string;
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .eq("id", providerId)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setProvider(data);
      }
      setLoading(false);
    };

    if (providerId) fetchProvider();
  }, [providerId]);

  if (loading) return <p>Loading provider profile...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!provider) return <p>No provider found</p>;

  return (
    <div className="min-h-screen bg-[#fff7e7]">
      {/* Navbar */}
      <AuthenticatedNavbar />

      {/* Main Content */}
      <div className="flex justify-center pt-8 pb-6">
        <div className="w-full max-w-lg">
          {/* Page Title */}
          <h2 className="text-[18px] font-bold text-black text-center mb-6">
            Book Service With {provider.full_name}(
            {provider.service_category[0]})
          </h2>

          {/* Form Container */}
          <div className="bg-white rounded-lg p-4 mx-2 shadow-sm">
            <div className="space-y-4">
              {/* Service Category */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-2">
                  Service Category
                </label>
                <div className="relative">
                  <Select
                    value={formData.serviceCategory}
                    onValueChange={(value: string) =>
                      handleInputChange("serviceCategory", value)
                    }
                  >
                    <SelectTrigger className="w-full h-8 text-[11px] border-[#a7a6ab] border-[1.5px] rounded-lg">
                      <SelectValue placeholder="Select service category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-2">
                  Service Type
                </label>
                <div className="relative">
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value: string) =>
                      handleInputChange("serviceType", value)
                    }
                  >
                    <SelectTrigger className="w-full h-8 text-[11px] border-[#a7a6ab] border-[1.5px] rounded-lg">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-2">
                  Date & Time
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={
                      formData.dateTime
                        ? new Date(formData.dateTime).toLocaleString()
                        : ""
                    }
                    readOnly
                    className="h-8 text-[11px] border-[#a7a6ab] border-[1.5px] rounded-lg pr-12 cursor-pointer"
                    placeholder="Select date & time"
                    onClick={() =>
                      document.getElementById("hidden-datetime-input")?.click()
                    }
                  />
                  <input
                    id="hidden-datetime-input"
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("dateTime", e.target.value)
                    }
                    className="absolute inset-0 opacity-0 pointer-events-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("hidden-datetime-input")?.click()
                    }
                    className="absolute right-1 top-1 w-6 h-6 border border-black flex items-center justify-center bg-[#FFA629] hover:bg-[#ff9500] transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-2">
                  Job Address
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="h-8 text-[11px] border-[#a7a6ab] border-[1.5px] rounded-lg pr-12"
                    placeholder="Provide your location (service location)"
                  />
                  <div className="absolute right-1 top-1 w-6 h-6 border border-black flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#FFA629] fill-current" />
                  </div>
                </div>
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-2">
                  Job Title
                </label>
                <Input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("jobTitle", e.target.value)
                  }
                  className="h-8 text-[11px] border-[#a7a6ab] border-[1.5px] rounded-lg"
                  placeholder="E.g., Paint 3-bedroom house inside and outside"
                />
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-2">
                  Budget Range (GHS)
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] text-black mb-1">
                      Minimum
                    </label>
                    <Input
                      type="number"
                      value={formData.minBudget}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("minBudget", e.target.value)
                      }
                      className="h-8 text-[11px] border-[#a7a6ab] border-[1.5px] rounded-lg"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] text-black mb-1">
                      Maximum
                    </label>
                    <Input
                      type="number"
                      value={formData.maxBudget}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("maxBudget", e.target.value)
                      }
                      className="h-8 text-[11px] border-[#a7a6ab] border-[1.5px] rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-2">
                  Job Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="h-24 text-[11px] border-[#a7a6ab] border-[1.5px] rounded-lg resize-none bg-white"
                  placeholder="Describe your problem"
                />
              </div>

              {/* Upload Media */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-2">
                  Upload media (optional)
                </label>
                <div className="relative">
                  <div className="h-24 border-[#a7a6ab] border-[1.5px] border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 bg-[#FFA629] rounded flex items-center justify-center">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] text-gray-600">
                        {formData.uploadedFiles.length > 0
                          ? `${formData.uploadedFiles.length} file(s) selected`
                          : "Click to upload files"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleSubmit}
                  className="bg-[#fe9f2b] hover:bg-[#e8912a] text-white h-10 px-8 rounded border-2 border-[#c26e09] text-[12.6px] font-black"
                >
                  Continue to confirmation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export for Next.js page component
export default function JobDetailsPage() {
  return (
    <BookServicePage
      onNavigateHome={() => {}}
      onNavigateToSignIn={() => {}}
      onContinueToConfirmation={() => {}}
    />
  );
}
