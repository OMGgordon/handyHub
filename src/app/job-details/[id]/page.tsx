"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Calendar, MapPin, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import CreatableSelect from "react-select/creatable";

import { Label } from "@/components/ui/label";
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
import { useRouter } from "next/navigation";
import DatePickerModal from "@/components/DatePickerModal";
import { useSession } from "@/context/SessionProvider";

interface BookServicePageProps {
  onNavigateHome: () => void;
  onNavigateToSignIn: () => void;
  onContinueToConfirmation: () => void;
  providerName?: string;
  providerService?: string;
}

interface FormData {
  id: string;
  serviceCategory: string;
  serviceType: string;
  dateTime: string[] | null;
  address: string;
  jobTitle: string;
  minBudget: number;
  maxBudget: number;
  description: string;
  providerId: string;
  clientId: string;
  uploadedFiles: File[];
  uploadedUrls: string[];
}

export function BookServicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    id: string;
    serviceCategory: string[] | null;
    serviceType: string;
    dateTime: string[] | null;
    address: string;
    jobTitle: string;
    minBudget: string;
    maxBudget: string;
    description: string;
    providerId: string;
    clientId: string;
    uploadedFiles: File[];
    uploadedUrls: string[];
  }>({
    id: "",
    serviceCategory: [],
    serviceType: "",
    dateTime: null,
    address: "",
    jobTitle: "",
    minBudget: "",
    maxBudget: "",
    description: "",
    providerId: "",
    clientId: "",
    uploadedFiles: [],
    uploadedUrls: [] as string[],
  });

  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const isEditing = searchParams.get("isEditing") === "true";

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // useEffect(() => {
  //   const fetchJobData = async () => {
  //     if (!jobId) return;

  //     const { data, error } = await supabase
  //       .from("projects")
  //       .select("*")
  //       .eq("id", jobId)
  //       .single();

  //     if (data && !error) {
  //       setFormData({
  //         serviceCategory: data.service_category,
  //         serviceType: data.service_type,
  //         dateTime: data.date,
  //         address: data.location,
  //         jobTitle: data.title,
  //         minBudget: data.min_budget,
  //         maxBudget: data.max_budget,
  //         description: data.description,
  //         uploadedFiles: data.uploaded_files,
  //       });
  //     }
  //   };

  //   fetchJobData();
  // }, [jobId]);

  const { session } = useSession();
  useEffect(() => {
    const fetchJobData = async () => {
      if (!jobId) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", jobId)
        .single();

      if (data && !error) {
        setFormData({
          id: data.id,
          serviceCategory: data.service_category,
          serviceType: data.service_type,
          dateTime: data.date,
          address: data.location,
          jobTitle: data.title,
          minBudget: data.min_budget,
          maxBudget: data.max_budget,
          description: data.description,
          uploadedFiles: [], // start with no new files
          uploadedUrls: data.uploaded_files || [], // optionally fetch uploaded files
          providerId: providerId,
          clientId: session?.user.id,
        });
      }
    };

    if (isEditing) fetchJobData();
  }, [jobId, isEditing]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleDateTimeClick = () => {
    setIsDatePickerOpen(true);
  };

  const handleDateTimeConfirm = (dateRange: string[]) => {
    setFormData((prev) => ({
      ...prev,
      dateTime: dateRange,
    }));
  };

  const serviceOptions = [
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "carpentry", label: "Carpentry" },
    { value: "painting", label: "Painting" },
    { value: "cleaning", label: "Cleaning" },
    { value: "gardening", label: "Gardening" },
  ];

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (files) {
    const newFiles = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...newFiles], // keep File[] separate
    }));
  }
};


  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(
        (file) => file.name !== fileName
      ),
    }));
  };

  // const handleSubmit = async () => {
  //   setClicked(true);
  //   try {
  //     // ✅ Get logged in user
  //     const {
  //       data: { user },
  //       error: userError,
  //     } = await supabase.auth.getUser();
  //     if (userError || !user) {
  //       alert("You need to sign in first.");
  //       return;
  //     }

  //     // ✅ Upload files to Supabase Storage (optional)
  //     const uploadedUrls: string[] = [];
  //     // for (const file of formData.uploadedFiles) {
  //     //   const { data, error: uploadError } = await supabase.storage
  //     //     .from("uploads") // 👈 make sure you have this bucket created
  //     //     .upload(`${user.id}/${Date.now()}-${file.name}`, file);

  //     //   if (uploadError) {
  //     //     console.error(uploadError);
  //     //   } else if (data) {
  //     //     const url = supabase.storage.from("uploads").getPublicUrl(data.path)
  //     //       .data.publicUrl;
  //     //     uploadedUrls.push(url);
  //     //   }
  //     // }

  //     // ✅ Insert into projects
  //     for (const file of formData.uploadedFiles) {
  //       const fileName = file.name || `file-${Date.now()}`; // fallback if name undefined
  //       const path = `${user.id}/${Date.now()}-${fileName}`;

  //       const { data, error } = await supabase.storage
  //         .from("uploads")
  //         .upload(path, file);

  //       if (error) {
  //         console.error("Upload error:", error);
  //         continue;
  //       }

  //       const { data: publicUrlData } = supabase.storage
  //         .from("uploads")
  //         .getPublicUrl(path);

  //       uploadedUrls.push(publicUrlData.publicUrl);
  //     }

  //     const { data, error } = await supabase
  //       .from("projects")
  //       .insert([
  //         {
  //           id: crypto.randomUUID(),
  //           provider_id: providerId,
  //           client_id: user.id,
  //           status: "pending",
  //           service_category: formData.serviceCategory,
  //           service_type: formData.serviceType,
  //           title: formData.jobTitle,
  //           min_budget: formData.minBudget,
  //           max_budget: formData.maxBudget,
  //           description: formData.description,
  //           uploaded_files: uploadedUrls, // ✅ store file URLs, not File objects
  //           date: formData.dateTime,
  //           location: formData.address,
  //         },
  //       ])
  //       .select()
  //       .single();

  //     if (error) {
  //       console.error(error);
  //       alert("Failed to create project.");
  //     } else {
  //       console.log("Project created:", data);
  //       // alert("Project submitted successfully!");
  //       // const jobId = data[0].id;
  //       router.push(`/job-summary/${data.id}`);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleSubmit = async () => {
    setClicked(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("You need to sign in first.");
        return;
      }

      const uploadedUrls: string[] = [...formData.uploadedUrls]; // keep old URLs

      for (const file of formData.uploadedFiles) {
        const fileName = file.name || `file-${Date.now()}`;
        const path = `${user.id}/${Date.now()}-${fileName}`;
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(path, file);

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from("uploads")
            .getPublicUrl(path);
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }


      if (isEditing && jobId) {
        // ✅ Update existing job
        const { data, error } = await supabase
          .from("projects")
          .update({
            service_category: formData.serviceCategory,
            service_type: formData.serviceType,
            title: formData.jobTitle,
            min_budget: formData.minBudget,
            max_budget: formData.maxBudget,
            description: formData.description,
            uploaded_files: uploadedUrls,
            date: formData.dateTime,
            location: formData.address,
          })
          .eq("id", jobId)
          .select()
          .single();

        if (error) {
          console.error(error);
          alert("Failed to update project.");
        } else {
          router.push(`/job-summary/${data.id}`);
        }
      } else {
        // ✅ Create new job
        const { data, error } = await supabase
          .from("projects")
          .insert([
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
              uploaded_files: uploadedUrls,
              date: formData.dateTime,
              location: formData.address,
            },
          ])
          .select()
          .single();

        if (error) {
          console.error(error);
          alert("Failed to create project.");
        } else {
          router.push(`/job-summary/${data.id}`);
        }
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

  console.log(formData);

  const handleServiceChange = (newValue: any) => {
    setFormData((prev: any) => ({
      ...prev,
      serviceCategory: newValue ? newValue.map((item: any) => item.value) : [],
    }));
  };

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
                    value={
                      Array.isArray(formData.serviceCategory) &&
                      formData.serviceCategory.length > 0
                        ? formData.serviceCategory[0]
                        : undefined
                    }
                    onValueChange={(value: string) =>
                      handleInputChange("serviceCategory", value)
                    }
                  >
                    <SelectTrigger className="w-full h-8 text-[11px] border-[#a7a6ab] border-[1.5px] rounded-lg">
                      <SelectValue placeholder="Select service category" />
                    </SelectTrigger>
                    <SelectContent>
                      {provider?.services && provider.services.length > 0
                        ? provider.services.map(
                            (service: string, idx: number) => (
                              <SelectItem key={idx} value={service}>
                                {service}
                              </SelectItem>
                            )
                          )
                        : provider?.service_category?.map(
                            (category: string, idx: number) => (
                              <SelectItem key={idx} value={category}>
                                {category}
                              </SelectItem>
                            )
                          )}
                    </SelectContent>
                  </Select>
                </div>

                {/* <Label className="text-sm font-medium text-gray-700">
                  Service Category
                </Label>
                <CreatableSelect
                  isMulti
                  options={serviceOptions}
                  onChange={handleServiceChange}
                  value={
                    formData?.serviceCategory?.map((value: string) => ({
                      value,
                      label: value.charAt(0).toUpperCase() + value.slice(1), // Capitalize for display
                    })) || []
                  }
                  placeholder="Select or type to create..."
                  className="mt-1"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "0.5rem", // 16px ~ Tailwind rounded-2xl
                      borderColor: "#d1d5db", // Tailwind gray-300
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#9ca3af", // Tailwind gray-400
                      },
                    }),
                  }}
                /> */}
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
                      formData.dateTime && formData.dateTime.length > 0
                        ? `${new Date(formData.dateTime[0]).toLocaleString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )} → ${new Date(
                            formData.dateTime[formData.dateTime.length - 1]
                          ).toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}`
                        : ""
                    }
                    readOnly
                    className="h-8 text-[11px] border-[#a7a6ab] border-[1.5px] rounded-lg pr-12 cursor-pointer"
                    placeholder="Select date & time"
                    onClick={handleDateTimeClick}
                  />

                  <button
                    type="button"
                    onClick={handleDateTimeClick}
                    className="absolute right-1 top-1 w-6 h-6 border border-black flex items-center justify-center bg-[#FFA629] hover:bg-[#ff9500] transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-2">
                  Job Location
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="h-8 text-[11px] border-[#a7a6ab] border-[1.5px] rounded-lg pr-12"
                    placeholder="Provide your location (job location)"
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
                  <div className="h-24 border-[#a7a6ab] border-[1.5px] border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    {/* Invisible file input */}
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
                        {uploadedFiles?.length > 0
                          ? `${uploadedFiles?.length} file(s) selected`
                          : "Click or drop files to upload"}
                      </span>
                    </div>
                  </div>

                  {/* Display selected files */}
                </div>
                {/* {formData?.uploadedFiles?.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData?.uploadedFiles?.map((file) => (
                      <div
                        key={file.name}
                        className="flex justify-between items-center border rounded p-2 px-3"
                      >
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4 text-gray-600" />
                          <div>
                            <span className="block text-[11px] font-medium">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.name)}
                          className="text-red-500 text-sm font-bold"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )} */}

                {formData.uploadedFiles.map((file) => (
                  <div
                    className="flex justify-between items-center border rounded p-2 px-3"
                    key={file.name}
                  >
                    <div className="flex flex-row">
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      <div>
                        {formData.uploadedUrls.map((url) => (
                          <div key={url} className="w-[50%]">
                            <a
                              href={url}
                              target="_blank"
                              className="text-blue-500 underline"
                            >
                              image
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.name)}
                      className="text-red-500 text-sm font-bold"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              {/* Continue Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={clicked}
                  className="bg-[#fe9f2b] hover:bg-[#e8912a] text-white h-10 px-8 rounded border-2 border-[#c26e09] text-[12.6px] font-black"
                >
                  Continue to confirmation
                </Button>
              </div>
            </div>
            <DatePickerModal
              open={isDatePickerOpen}
              onOpenChange={setIsDatePickerOpen}
              onConfirm={(dateTimes) => {
                handleDateTimeConfirm(dateTimes);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export for Next.js page component
export default function JobDetailsPage() {
  return <BookServicePage />;
}
