"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import CreatableSelect from "react-select/creatable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SendHorizontal, Upload, User } from "lucide-react";
import Image from "next/image";
import UploadDropzone from "@/components/UploadDropzone";
import { supabase } from "@/lib/supabase";
import { LocationInput } from "@/components/LocationInput";

const serviceOptions = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "carpentry", label: "Carpentry" },
  { value: "painting", label: "Painting" },
  { value: "cleaning", label: "Cleaning" },
  { value: "gardening", label: "Gardening" },
];

export default function HandyHiveOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    serviceCategory: [],
    workLocation: "",
    experience: "",
    uploadedFiles: [],
    price: "",
    bio: "",
    
  });

  //   const handleSubmit = async () => {
  //     if (currentStep < 4) {
  //       setCurrentStep((prev) => prev + 1);
  //     } else {
  //       // Handle form submission
  //       console.log("Form submitted:", formData);

  //       const { data, error } = await supabase.auth.signUp({
  //             email: formData.emailAddress,
  //             password: formData.password,
  //             options: {
  //               data: { userType: "provider" },
  //             },
  //           });

  //       const { data, error } = await supabase.auth.updateUser({
  //         data: {
  //           full_name: formData.fullName,
  //           email: formData.emailAddress,
  //           phone: formData.phoneNumber,

  //           service: formData.serviceCategory,
  //           location: formData.workLocation,
  //           experience: formData.experience,

  //           //TODO: upload files to Supabase Storage
  //           uploaded_files: formData.uploadedFiles,
  //         },
  //       });

  //       if (error) {
  //         console.error("Failed to update user:", error.message);
  //       } else {
  //         console.log("User updated:", data);
  //         router.push("/landing-page");
  //       }
  //     }
  //   };

  const handleSubmit = async () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setLoading(true);
      // Handle form submission
      console.log("Form submitted:", formData);

      // Step 1: Sign up the user
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: formData.emailAddress,
          password: formData.password,
          options: {
            data: { userType: "provider" }, // metadata stored in auth.users
          },
        });

      if (signUpError) {
        console.error("Sign-up failed:", signUpError.message);
        return;
      }

      const userId = signUpData.user?.id; // <-- must use this for the FK
      if (!userId) {
        console.error("No user.id returned from signUp");
        return;
      }

      const user = signUpData.user;
      if (!user) {
        console.error("No user returned after sign-up");
        return;
      }

      // Step 2: Insert into service_providers table
      const { data: providerData, error: providerError } = await supabase
        .from("service_providers")
        .insert([
          {
            id: crypto.randomUUID(), // or use user.id if you want 1-to-1 mapping
            user_id: userId, // link to auth user
            full_name: formData.fullName,
            service_category: formData.serviceCategory,
            price: formData.price || 0,
            rating: 0,
            review_count: 0,
            verified: false,
            completed_projects: 0,
            bio: formData.bio || `Hi, I'm a ${formData.serviceCategory[0]}`,
            avatar: null, // handle upload separately
            location: formData.workLocation,
            availability: [],
            timeslots: [],
            phone_number: formData.phoneNumber,
            experience: formData.experience,
            uploaded_files: formData.uploadedFiles
          },
        ]);

      if (providerError) {
        console.error(
          "Failed to insert service provider:",
          providerError.message
        );
      } else {
        console.log("Provider inserted:", providerData);
        setMessage("Check your email to confirm your account.");
        setShowDialog(true);
      }
    }
  };

  const handleServiceChange = (newValue: any) => {
    setFormData((prev: any) => ({
      ...prev,
      serviceCategory: newValue ? newValue.map((item: any) => item.value) : [],
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [files, setFiles] = useState<File[]>([]);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return {
          fields: [
            { key: "fullName" },
            { key: "emailAddress" },
            { key: "phoneNumber" },
            { key: "password" },
            { key: "confirmPassword" },
          ],
        };
      case 2:
        return {
          fields: [
            { key: "serviceCategory" },
            { key: "workLocation" },
            { key: "experience" },
          ],
        };
      case 3:
        return {
          fields: [{ key: "uploadedFiles" }],
        };
      default:
        return { fields: [] };
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full ${
              step <= currentStep ? "bg-orange-400" : "bg-gray-300"
            }`}
          />
          {step < 3 && <div className="w-8 h-0.5 bg-gray-300 mx-2" />}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          className="mt-1 bg-white"
        />
      </div>

      <div>
        <Label
          htmlFor="emailAddress"
          className="text-sm font-medium text-gray-700"
        >
          Email Address
        </Label>
        <Input
          id="emailAddress"
          type="email"
          value={formData.emailAddress}
          onChange={(e) => handleInputChange("emailAddress", e.target.value)}
          className="mt-1 bg-white"
        />
      </div>

      <div>
        <Label
          htmlFor="phoneNumber"
          className="text-sm font-medium text-gray-700"
        >
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          className="mt-1 bg-white"
        />
      </div>

      <div>
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className="mt-1 bg-white"
        />
      </div>

      <div>
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          className="mt-1 bg-white"
        />
      </div>

      <Button
        onClick={handleNext}
        disabled={
          !getStepContent().fields.every((field) => formData[field.key as keyof typeof formData]) ||
          loading
        }
        className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-md"
      >
        Continue
      </Button>

      {/* <div className="text-center">
        <span className="text-sm text-gray-500">Continue with Google</span>
      </div> */}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-10 h-10 text-gray-400" />
        </div>
        {/* <span className="p-2 bg-primary rounded-full">+</span> */}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">
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
        />
      </div>

      <div>
        <Label
          htmlFor="workLocation"
          className="text-sm font-medium text-gray-700"
        >
          Work Location
        </Label>
        <Input
          id="location"
          type="location"
          value={formData.workLocation}
          onChange={(e) => handleInputChange("workLocation", e.target.value)}
          className="mt-1 bg-white"
        />
        {/* <LocationInput formData={formData} setFormData={setFormData} /> */}
      </div>

      <div>
        <Label htmlFor="pricing" className="text-sm font-medium text-gray-700">
          Pricing
        </Label>
        <Input
          id="location"
          type="location"
          value={formData.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
          className="mt-1 bg-white"
        />
        {/* <LocationInput formData={formData} setFormData={setFormData} /> */}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">
          Years of Experience
        </Label>
        <Select
          value={formData.experience}
          onValueChange={(value) => handleInputChange("experience", value)}
        >
          <SelectTrigger className="mt-1 bg-white w-full">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-1">0-1 years</SelectItem>
            <SelectItem value="1-3">1-3 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-4">
        <Button onClick={handleBack} variant="outline" className="flex-1 py-3">
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            !getStepContent().fields.every((field) => formData[field.key as keyof typeof formData])
          }
          className="flex-1 bg-orange-400 hover:bg-orange-500 text-white py-3"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Upload documents to verify your information
        </h3>

        <div className="">
          <h3 className="text-gray-400 text-sm">
            Upload a picture of your Ghana card (front and back) and any
            additional ID or certifications.
          </h3>
          <Card className="border-2 border-dashed border-gray-300 hover:border-orange-400 cursor-pointer">
            <CardContent className="p-6 text-center w-full">
              <UploadDropzone onFilesChange={handleFilesChange} />
              {/* {files.length > 0 && (
                <div
                  className="flex justify-end mt-4"
                  onClick={() => {
                    // setNewMessage(mediaUpload);
                    // handleSendMessage();
                    // setOpenUpload(false);
                  }}
                >
                  <SendHorizontal />
                </div>
              )} */}
              {/* <p className="text-sm text-gray-600">Upload ID</p> */}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* 
      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>
          By uploading a verification code email effective and we are confirming
        </p>
        <p>HandyHive policies and terms Please check</p>
      </div> */}

      <div className="flex space-x-4">
        <Button onClick={handleBack} variant="outline" className="flex-1 py-3">
          Back
        </Button>
        <Button
          className="flex-1 bg-orange-400 hover:bg-orange-500 text-white py-3"
          disabled={
            !getStepContent().fields.every((field) => formData[field.key as keyof typeof formData])
          }
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-1/2  p-8  flex-col hidden lg:flex justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10 ">
          <div className="">
            <Image
              aria-hidden
              src="/man1.png"
              alt="man smiling"
              fill
              className="object-cover object-center h-full w-full"
            />
          </div>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center mb-12">
            <Image
              aria-hidden
              src="/Logo.png"
              alt="man smiling"
              width={150}
              height={500}
            />
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <h1 className="text-center text-3xl font-segoe font-extrabold text-primary ">
              Join HandyHive
            </h1>
            <h1 className="text-xl text-center font-semibold text-gray-800 leading-tight">
              Get jobs, grow your skills, and connect with clients near you.
            </h1>

            <div className="space-y-6">
              <div className="flex space-x-10 items-center">
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-normal">💼</span>
                </div>
                <div>
                  <h3 className="font-normal text-gray-800">
                    Get discovered by customers near you
                  </h3>
                </div>
              </div>

              <div className="flex space-x-10 items-center">
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">💰</span>
                </div>
                <div>
                  <h3 className="font-normal text-gray-800">
                    Set your own rates and work schedule
                  </h3>
                </div>
              </div>

              <div className="flex space-x-10 items-center">
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">📱</span>
                </div>
                <div>
                  <h3 className="font-normal text-gray-800">
                    Showcase your skills and build your reputation
                  </h3>
                </div>
              </div>

              <div className="flex space-x-10 items-center">
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">🛡️</span>
                </div>
                <div>
                  <h3 className="font-normal text-gray-800">
                    Verified Jobs from trusted customers
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-1/2 p-8 bg-[#FAF0DF] flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              Get Started
            </h2>
            <p className="text-gray-600">
              {currentStep === 1 &&
                "Sign up to be able to book jobs and get hired by customers in need of your service"}
              {currentStep === 2 &&
                "Lets start with the basic information to set up your profile and start receiving job requests \n\n You can complete your profile later "}
              {currentStep === 3 &&
                "Upload document to verify your information"}
            </p>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Form Content */}
          <div className=" p-8  ">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
        </div>
      </div>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Almost there!</AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                router.push("/");
                setShowDialog(false);
              }}
            >
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
