"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "@/context/SessionProvider";
import { useRouter } from "next/navigation";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { Camera, Upload, Star, Phone, Mail, MapPin, Clock, CreditCard, Shield, Award, CheckCircle, AlertCircle } from "lucide-react";

interface ProfileData {
  // Profile Info
  photo: string;
  name: string;
  jobTitle: string;
  about: string;
  yearsExperience: number;
  
  // Services & Pricing
  services: string[];
  categories: string[];
  pricingNotes: string;
  startingRate: number;
  
  // Business Details
  highlights: string[];
  serviceHours: {
    [key: string]: { start: string; end: string; available: boolean };
  };
  paymentMethods: string[];
  
  // Portfolio & Reviews
  portfolioImages: { url: string; caption: string }[];
  reviews: any[];
  
  // Verification & Contact
  phone: string;
  email: string;
  address: string;
  serviceArea: string;
  hasLicense: boolean;
  hasInsurance: boolean;
  certificates: string[];
}

export default function ProfileUpdatePage() {
  const { session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile-info");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const portfolioRef = useRef<HTMLInputElement>(null);
  const certificateRef = useRef<HTMLInputElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    photo: "/profile.png",
    name: session?.user?.user_metadata?.fullName || "",
    jobTitle: "",
    about: "",
    yearsExperience: 0,
    services: [],
    categories: [],
    pricingNotes: "",
    startingRate: 0,
    highlights: [],
    serviceHours: {
      Monday: { start: "09:00", end: "17:00", available: true },
      Tuesday: { start: "09:00", end: "17:00", available: true },
      Wednesday: { start: "09:00", end: "17:00", available: true },
      Thursday: { start: "09:00", end: "17:00", available: true },
      Friday: { start: "09:00", end: "17:00", available: true },
      Saturday: { start: "09:00", end: "15:00", available: true },
      Sunday: { start: "10:00", end: "14:00", available: false },
    },
    paymentMethods: [],
    portfolioImages: [],
    reviews: [],
    phone: "",
    email: session?.user?.email || "",
    address: "",
    serviceArea: "",
    hasLicense: false,
    hasInsurance: false,
    certificates: [],
  });

  const serviceOptions = [
    "Plumbing", "Electrical", "HVAC", "Painting", "Carpentry", "Roofing",
    "Landscaping", "Cleaning", "Handyman", "Appliance Repair", "Flooring",
    "Drywall", "Concrete", "Windows & Doors", "Tile Work", "Kitchen Remodel",
    "Bathroom Remodel", "Pest Control", "Security Systems", "Pool Services"
  ];

  const categoryOptions = [
    "Repair & Maintenance", "Installation", "Renovation", "Emergency Services",
    "Consultation", "Inspection", "Custom Work", "Commercial", "Residential"
  ];

  const highlightOptions = [
    "Licensed Professional", "Insured", "24/7 Emergency Service", "Free Estimates",
    "Same Day Service", "Warranty Provided", "Eco-Friendly Options", "Senior Discounts",
    "Military Discounts", "Financing Available", "Locally Owned", "BBB Accredited"
  ];

  const paymentOptions = [
    "Cash", "Check", "Credit Card", "Debit Card", "PayPal", "Venmo",
    "Bank Transfer", "Financing", "Payment Plans"
  ];

  const updateProfileData = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Trigger autosave after 2 seconds of inactivity
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 2000);
  };

  const autoSave = useCallback(async () => {
    setAutoSaveStatus('saving');
    try {
      // TODO: Implement autosave to Supabase
      console.log("Auto-saving profile data:", profileData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      
      // Reset status after 3 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    } catch (error) {
      console.error("Error auto-saving profile:", error);
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    }
  }, [profileData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateProfileData('photo', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceHourChange = (day: string, field: 'start' | 'end' | 'available', value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      serviceHours: {
        ...prev.serviceHours,
        [day]: {
          ...prev.serviceHours[day],
          [field]: value
        }
      }
    }));
  };

  const toggleArrayItem = (array: string[], item: string, field: string) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    updateProfileData(field, newArray);
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          url: e.target?.result as string,
          caption: `Project ${profileData.portfolioImages.length + 1}`
        };
        setProfileData(prev => ({
          ...prev,
          portfolioImages: [...prev.portfolioImages, newImage]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const validateTab = (tabName: string): boolean => {
    switch (tabName) {
      case 'profile-info':
        return !!(profileData.name && profileData.jobTitle);
      case 'services-pricing':
        return profileData.services.length > 0;
      case 'verification-contact':
        return !!(profileData.phone && profileData.email);
      default:
        return true;
    }
  };

  const getTabCompletionStatus = (tabName: string): 'complete' | 'incomplete' | 'partial' => {
    if (validateTab(tabName)) return 'complete';
    
    // Check for partial completion
    switch (tabName) {
      case 'profile-info':
        return (profileData.name || profileData.jobTitle) ? 'partial' : 'incomplete';
      case 'services-pricing':
        return profileData.services.length > 0 ? 'partial' : 'incomplete';
      case 'verification-contact':
        return (profileData.phone || profileData.email) ? 'partial' : 'incomplete';
      default:
        return 'incomplete';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement save to Supabase
      console.log("Saving profile data:", profileData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message or redirect
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7e7]">
      <AuthenticatedNavbar />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Update Your Profile
              </h1>
              <p className="text-gray-600">
                Keep your profile up to date to attract more clients and showcase your expertise.
              </p>
            </div>
            
            {/* Auto-save Status */}
            <div className="flex items-center gap-2 text-sm">
              {autoSaveStatus === 'saving' && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  Saving...
                </div>
              )}
              {autoSaveStatus === 'saved' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Saved
                </div>
              )}
              {autoSaveStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  Save failed
                </div>
              )}
              {lastSaved && autoSaveStatus === 'idle' && (
                <span className="text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs with Left Navigation */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Navigation */}
          <div className="w-full lg:w-72 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit lg:sticky lg:top-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Setup</h3>
              <p className="text-sm text-gray-500">Complete your professional profile</p>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile-info')}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-xl transition-all duration-200 ${
                  activeTab === 'profile-info'
                    ? 'bg-[#fe9f2b] text-white shadow-sm'
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeTab === 'profile-info' ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <Camera className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">Profile Info</div>
                  <div className="text-xs opacity-75 truncate">Basic information & photo</div>
                </div>
                {getTabCompletionStatus('profile-info') === 'complete' && (
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('services-pricing')}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-xl transition-all duration-200 ${
                  activeTab === 'services-pricing'
                    ? 'bg-[#fe9f2b] text-white shadow-sm'
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeTab === 'services-pricing' ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">Services & Pricing</div>
                  <div className="text-xs opacity-75 truncate">What you offer & rates</div>
                </div>
                {getTabCompletionStatus('services-pricing') === 'complete' && (
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('business-details')}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-xl transition-all duration-200 ${
                  activeTab === 'business-details'
                    ? 'bg-[#fe9f2b] text-white shadow-sm'
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeTab === 'business-details' ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">Business Details</div>
                  <div className="text-xs opacity-75 truncate">Hours & highlights</div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('portfolio-reviews')}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-xl transition-all duration-200 ${
                  activeTab === 'portfolio-reviews'
                    ? 'bg-[#fe9f2b] text-white shadow-sm'
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeTab === 'portfolio-reviews' ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <Star className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">Portfolio & Reviews</div>
                  <div className="text-xs opacity-75 truncate">Showcase your work</div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('verification-contact')}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-xl transition-all duration-200 ${
                  activeTab === 'verification-contact'
                    ? 'bg-[#fe9f2b] text-white shadow-sm'
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeTab === 'verification-contact' ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <Shield className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">Verification & Contact</div>
                  <div className="text-xs opacity-75 truncate">Credentials & contact info</div>
                </div>
                {getTabCompletionStatus('verification-contact') === 'complete' && (
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                )}
              </button>
            </nav>
            
            {/* Progress Indicator */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Profile Completion</span>
                <span className="font-medium text-gray-900">
                  {Math.round((
                    [
                      getTabCompletionStatus('profile-info'),
                      getTabCompletionStatus('services-pricing'),
                      getTabCompletionStatus('verification-contact')
                    ].filter(status => status === 'complete').length / 3
                  ) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#fe9f2b] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round((
                      [
                        getTabCompletionStatus('profile-info'),
                        getTabCompletionStatus('services-pricing'),
                        getTabCompletionStatus('verification-contact')
                      ].filter(status => status === 'complete').length / 3
                    ) * 100)}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <Tabs value={activeTab} className="w-full">
              {/* Tab Contents */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Profile Info Tab */}
            <TabsContent value="profile-info" className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-[#fe9f2b]" />
                  Profile Information
                </CardTitle>
                <p className="text-gray-600">Update your basic profile information and professional details.</p>
              </CardHeader>
              
              <CardContent className="px-0 space-y-6">
                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={profileData.photo}
                        alt="Profile"
                        width={100}
                        height={100}
                        className="rounded-full object-cover border-4 border-gray-200"
                      />
                      <button
                        onClick={() => profilePhotoRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-[#fe9f2b] text-white rounded-full p-2 hover:bg-[#e8912a] transition-colors"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Upload a professional photo to build trust with clients
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => profilePhotoRef.current?.click()}
                        className="text-sm"
                      >
                        Choose Photo
                      </Button>
                    </div>
                  </div>
                  <input
                    ref={profilePhotoRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {/* Name and Job Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => updateProfileData('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Professional Title *</Label>
                    <Input
                      id="jobTitle"
                      value={profileData.jobTitle}
                      onChange={(e) => updateProfileData('jobTitle', e.target.value)}
                      placeholder="e.g., Master Plumber, Licensed Electrician"
                    />
                  </div>
                </div>

                {/* Years of Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select
                    value={profileData.yearsExperience.toString()}
                    onValueChange={(value) => updateProfileData('yearsExperience', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select years of experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(50)].map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>
                          {i + 1} year{i + 1 > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* About */}
                <div className="space-y-2">
                  <Label htmlFor="about">About You</Label>
                  <Textarea
                    id="about"
                    value={profileData.about}
                    onChange={(e) => updateProfileData('about', e.target.value)}
                    placeholder="Tell clients about your experience, specialties, and what makes you stand out..."
                    rows={4}
                  />
                  <p className="text-sm text-gray-500">
                    {profileData.about.length}/500 characters
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving} className="bg-[#fe9f2b] hover:bg-[#e8912a]">
                    {isSaving ? 'Saving...' : 'Save & Continue'}
                  </Button>
                </div>
              </CardContent>
            </TabsContent>

            {/* Services & Pricing Tab */}
            <TabsContent value="services-pricing" className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#fe9f2b]" />
                  Services & Pricing
                </CardTitle>
                <p className="text-gray-600">Define the services you offer and your pricing structure.</p>
              </CardHeader>
              
              <CardContent className="px-0 space-y-6">
                {/* Services Offered */}
                <div className="space-y-3">
                  <Label>Services Offered *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {serviceOptions.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={profileData.services.includes(service)}
                          onCheckedChange={() => toggleArrayItem(profileData.services, service, 'services')}
                        />
                        <Label htmlFor={service} className="text-sm">{service}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <Label>Service Categories</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categoryOptions.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={profileData.categories.includes(category)}
                          onCheckedChange={() => toggleArrayItem(profileData.categories, category, 'categories')}
                        />
                        <Label htmlFor={category} className="text-sm">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startingRate">Starting Rate (GHS/hour)</Label>
                    <Input
                      id="startingRate"
                      type="number"
                      value={profileData.startingRate}
                      onChange={(e) => updateProfileData('startingRate', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Pricing Notes */}
                <div className="space-y-2">
                  <Label htmlFor="pricingNotes">Pricing Notes</Label>
                  <Textarea
                    id="pricingNotes"
                    value={profileData.pricingNotes}
                    onChange={(e) => updateProfileData('pricingNotes', e.target.value)}
                    placeholder="Explain your pricing structure, minimum charges, travel fees, etc."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving} className="bg-[#fe9f2b] hover:bg-[#e8912a]">
                    {isSaving ? 'Saving...' : 'Save & Continue'}
                  </Button>
                </div>
              </CardContent>
            </TabsContent>

            {/* Business Details Tab */}
            <TabsContent value="business-details" className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#fe9f2b]" />
                  Business Details
                </CardTitle>
                <p className="text-gray-600">Showcase your business highlights and availability.</p>
              </CardHeader>
              
              <CardContent className="px-0 space-y-6">
                {/* Highlights */}
                <div className="space-y-3">
                  <Label>Business Highlights</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {highlightOptions.map((highlight) => (
                      <div key={highlight} className="flex items-center space-x-2">
                        <Checkbox
                          id={highlight}
                          checked={profileData.highlights.includes(highlight)}
                          onCheckedChange={() => toggleArrayItem(profileData.highlights, highlight, 'highlights')}
                        />
                        <Label htmlFor={highlight} className="text-sm">{highlight}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Hours */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Service Hours
                  </Label>
                  <div className="space-y-3">
                    {Object.entries(profileData.serviceHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-20">
                          <Checkbox
                            id={`${day}-available`}
                            checked={hours.available}
                            onCheckedChange={(checked) => handleServiceHourChange(day, 'available', checked as boolean)}
                          />
                          <Label htmlFor={`${day}-available`} className="ml-2 text-sm font-medium">
                            {day}
                          </Label>
                        </div>
                        {hours.available && (
                          <>
                            <Input
                              type="time"
                              value={hours.start}
                              onChange={(e) => handleServiceHourChange(day, 'start', e.target.value)}
                              className="w-32"
                            />
                            <span className="text-gray-500">to</span>
                            <Input
                              type="time"
                              value={hours.end}
                              onChange={(e) => handleServiceHourChange(day, 'end', e.target.value)}
                              className="w-32"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <Label>Accepted Payment Methods</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {paymentOptions.map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={method}
                          checked={profileData.paymentMethods.includes(method)}
                          onCheckedChange={() => toggleArrayItem(profileData.paymentMethods, method, 'paymentMethods')}
                        />
                        <Label htmlFor={method} className="text-sm">{method}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving} className="bg-[#fe9f2b] hover:bg-[#e8912a]">
                    {isSaving ? 'Saving...' : 'Save & Continue'}
                  </Button>
                </div>
              </CardContent>
            </TabsContent>

            {/* Portfolio & Reviews Tab */}
            <TabsContent value="portfolio-reviews" className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#fe9f2b]" />
                  Portfolio & Reviews
                </CardTitle>
                <p className="text-gray-600">Showcase your work and client testimonials.</p>
              </CardHeader>
              
              <CardContent className="px-0 space-y-6">
                {/* Portfolio Images */}
                <div className="space-y-3">
                  <Label>Portfolio Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {profileData.portfolioImages.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image.url}
                          alt={image.caption}
                          width={200}
                          height={150}
                          className="rounded-lg object-cover"
                        />
                        <button
                          onClick={() => {
                            const newImages = profileData.portfolioImages.filter((_, i) => i !== index);
                            updateProfileData('portfolioImages', newImages);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => portfolioRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg h-36 flex flex-col items-center justify-center hover:border-[#fe9f2b] transition-colors"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add Photo</span>
                    </button>
                  </div>
                  <input
                    ref={portfolioRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePortfolioUpload}
                    className="hidden"
                  />
                </div>

                {/* Reviews Section */}
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Client Reviews</h3>
                  {profileData.reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No reviews yet. Complete your first job to start collecting reviews!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profileData.reviews.map((review, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{review.clientName}</h4>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving} className="bg-[#fe9f2b] hover:bg-[#e8912a]">
                    {isSaving ? 'Saving...' : 'Save & Continue'}
                  </Button>
                </div>
              </CardContent>
            </TabsContent>

            {/* Verification & Contact Tab */}
            <TabsContent value="verification-contact" className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#fe9f2b]" />
                  Verification & Contact
                </CardTitle>
                <p className="text-gray-600">Verify your credentials and provide contact information.</p>
              </CardHeader>
              
              <CardContent className="px-0 space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => updateProfileData('phone', e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => updateProfileData('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Address and Service Area */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Business Address
                    </Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => updateProfileData('address', e.target.value)}
                      placeholder="Enter your business address"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceArea">Service Area</Label>
                    <Input
                      id="serviceArea"
                      value={profileData.serviceArea}
                      onChange={(e) => updateProfileData('serviceArea', e.target.value)}
                      placeholder="e.g., Accra, East Legon, Airport City (within 25km)"
                    />
                  </div>
                </div>

                {/* Verification */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Professional Verification</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasLicense"
                        checked={profileData.hasLicense}
                        onCheckedChange={(checked) => updateProfileData('hasLicense', checked)}
                      />
                      <Label htmlFor="hasLicense">I have a professional license</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasInsurance"
                        checked={profileData.hasInsurance}
                        onCheckedChange={(checked) => updateProfileData('hasInsurance', checked)}
                      />
                      <Label htmlFor="hasInsurance">I have liability insurance</Label>
                    </div>
                  </div>
                </div>

                {/* Certificate Upload */}
                <div className="space-y-3">
                  <Label>Certificates & Licenses</Label>
                  <div className="space-y-2">
                    {profileData.certificates.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">{cert}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newCerts = profileData.certificates.filter((_, i) => i !== index);
                            updateProfileData('certificates', newCerts);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => certificateRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Certificate
                    </Button>
                    <input
                      ref={certificateRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        // Handle certificate upload
                        const file = e.target.files?.[0];
                        if (file) {
                          const newCerts = [...profileData.certificates, file.name];
                          updateProfileData('certificates', newCerts);
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="bg-[#fe9f2b] hover:bg-[#e8912a]">
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </CardContent>
            </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}