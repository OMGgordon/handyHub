import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import UploadDropzone from "./UploadDropzone";
import { supabase } from "@/lib/supabase";

type FormData  = {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  experience: string;
  hourlyRate: string;
  availability: string;
  workRadius: string;
  uploadedFiles: File[]; // or string[] or whatever you store
};

const OnboardingModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Step 1
    fullName: "",
    email: "",
    phone: "",

    // Step 2
    service: "",
    location: "",
    experience: "",
    // Step 3
    hourlyRate: "",
    availability: "",
    workRadius: "",
    // Step 4
    // portfolio: "",
    // certifications: "".,
    // description: "",

    uploadedFiles: [],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Handle form submission
      console.log("Form submitted:", formData);
      setIsOpen(false);

      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,

          service: formData.service,
          location: formData.location,
          experience: formData.experience,

          hourlyRate: formData.hourlyRate,
          availability: formData.availability,
          workRadius: formData.workRadius,

          //TODO: upload files to Supabase Storage
          uploaded_files: formData.uploadedFiles,
        },
      });

      if (error) {
        console.error("Failed to update user:", error.message);
      } else {
        console.log("User updated:", data);
        router.push("/landing-page");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
    console.log("clicked back");
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 2:
        return {
          title: "Get started with the basics",
          subtitle:
            "Sign up to able to book jobs and get hired by client in need of your service.",
          fields: [
            {
              label: "Service",
              key: "service",
              placeholder: "e.g., Carpentry, Plumbing, Electricals",
              type: "text",
            },
            {
              label: "Location",
              key: "location",
              placeholder: "e.g., East Legon, Accra",
              type: "text",
            },
            {
              label: "Years of experience",
              key: "experience",
              placeholder: "e.g., 5",
              type: "number",
            },
          ],
        };
      case 1:
        return {
          title: "Personal Information",
          subtitle:
            "Let us know more about you so clients can reach out easily.",
          fields: [
            {
              label: "Full Name",
              key: "fullName",
              placeholder: "Enter your full name",
              type: "text",
            },
            {
              label: "Email Address",
              key: "email",
              placeholder: "your.email@example.com",
              type: "email",
            },
            {
              label: "Phone Number",
              key: "phone",
              placeholder: "+233 XX XXX XXXX",
              type: "tel",
            },
          ],
        };
      case 3:
        return {
          title: "Service Details",
          subtitle: "Help clients understand your pricing and availability.",
          fields: [
            {
              label: "Hourly Rate (GHS)",
              key: "hourlyRate",
              placeholder: "e.g., 50",
              type: "number",
            },
            {
              label: "Availability",
              key: "availability",
              placeholder: "e.g., Monday - Friday, 8AM - 6PM",
              type: "text",
            },
            {
              label: "Work Radius (km)",
              key: "workRadius",
              placeholder: "e.g., 15",
              type: "number",
            },
          ],
        };
        //   case 4:
        return {
          title: "Complete Your Profile",
          subtitle: "Add some final touches to make your profile stand out.",
          fields: [
            {
              label: "Portfolio/Previous Work",
              key: "portfolio",
              placeholder: "Describe your best projects or upload links",
              type: "textarea",
            },
            {
              label: "Certifications",
              key: "certifications",
              placeholder: "List any relevant certifications or training",
              type: "text",
            },
            {
              label: "Brief Description",
              key: "description",
              placeholder: "Tell clients why they should choose you...",
              type: "textarea",
            },
          ],
        };
      default:
        return { title: "", subtitle: "", fields: [] };
    }
  };

  if (!isOpen) return null;

  const stepContent = getStepContent();

  //   console.log("FormData", formData);

  return (
    <div className="flex items-center justify-center p-4 relative z-10">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-auto shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={currentStep === 1}
            >
              <ArrowLeft
                className={`h-5 w-5 ${
                  currentStep === 1 ? "text-gray-300" : "text-gray-600"
                }`}
              />
            </button>

            {currentStep >= 2 && (
              <button
                onClick={() => router.push("/landing-page")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                Skip
              </button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 w-full">
            {[1, 2, 3, 4].map((step, index) => (
              <React.Fragment key={step}>
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step <= currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? "✓" : step}
                </div>

                {/* Connector Line */}
                {index < 3 && (
                  <div
                    className={`flex-1 h-0.5 m-1 ${
                      step < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-4">
            {currentStep === 4 && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Upload a valid Identification Card
                </label>
                <UploadDropzone
                  onFilesChange={(files) =>
                    setFormData((prev) => ({ ...prev, uploadedFiles: files }))
                  }
                />
              </div>
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {stepContent.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {stepContent.subtitle}
              </p>
            </div>

            {/* Dynamic Form Fields */}
            <div className="space-y-4 sm:space-y-6 max-h-96 overflow-y-auto">
              {stepContent.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={formData[field.key]}
                      onChange={(e) =>
                        handleInputChange(field.key, e.target.value)
                      }
                      className="w-[98%] m-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] outline-none transition-colors resize-none"
                      placeholder={field.placeholder}
                      rows={3}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      value={formData[field.key]}
                      onChange={(e) =>
                        handleInputChange(field.key, e.target.value)
                      }
                      className="w-[98%] m-2 px-2 py-3 border border-gray-300 rounded-lg outline-none transition-colors"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 pt-4 bg-gray-50">
          <button
            disabled={
              !getStepContent().fields.every((field) => formData[field.key])
            }
            onClick={handleNext}
            className={`w-full ${
              getStepContent().fields.every((field) => formData[field.key])
                ? "bg-orange-400 hover:bg-orange-500"
                : "bg-gray-300 cursor-not-allowed"
            }   text-white font-medium py-3 px-4 rounded-lg transition-colors mb-4 text-sm sm:text-base`}
          >
            {currentStep === 4 ? "COMPLETE SIGNUP" : "NEXT"}
          </button>

          <div className="text-center">
            <span className="text-gray-600 text-sm">Questions? </span>
            <button className="text-orange-400 hover:text-orange-500 font-medium text-sm">
              Call Admin
            </button>
          </div>
        </div>

        {/* Step indicator for mobile */}
        <div className="absolute top-4 right-16 bg-white px-2 py-1 rounded-full text-xs text-gray-500 sm:hidden">
          {currentStep}/4
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
