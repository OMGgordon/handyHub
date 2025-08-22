// components/ServiceProviderSearch.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, Star, MapPin, Calendar, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";

// Types
interface ServiceProvider {
  id: string;
  user_id: string;
  full_name: string;
  services: string[];
  price: number;
  rating: number;
  review_count: number;
  verified: boolean;
  completed_projects: number;
  bio: string;
  avatar: string;
  location: string;
  availability: string[];
  timeSlots: string[];
}

// // Mock data - replace with actual Supabase data
// const mockProviders: ServiceProvider[] = [
//   {
//     id: "1",
//     full_name: "Mensah The Plumber",
//     services: "Plumbing",
//     price: 1000,
//     rating: 4.9,
//     review_count: 127,
//     verified: true,
//     completed_projects: 76,
//     bio:
//       "I have 6 years of experience and today I have my tools for the job. I try to serve the customer in the best possible way, solving all their problems.",
//     avatar: "/api/placeholder/80/80",
//     location: "Accra, Ghana",
//     availability: ["Today", "Within a day", "Within a Week"],
//     timeSlots: [
//       "Morning (6am - 12pm)",
//       "Afternoon (12pm - 6pm)",
//       "Evening (6pm - 12am)",
//     ],
//   },
//   // Add more mock data as needed
// ];

const ServiceProviderSearch: React.FC = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedAvailability, setSelectedAvailability] = useState("today");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [loading, setLoading] = useState(false);

  // Fetch providers from Supabase
  const fetchProviders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .order("rating", { ascending: false });

      console.log(data, "data");
      if (data) {
        setProviders(data);
        setFilteredProviders(data);
      }

      if (error) {
        console.error("Error fetching providers:", error);
        return;
      }

      setProviders(data);
      setFilteredProviders(data);
      console.log(filteredProviders, "filtered prov");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
    
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = [...providers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (provider) =>
          provider.full_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          provider.services.map((service)=> service.toLowerCase().includes(searchQuery.toLowerCase())) ||
          provider.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(
      (provider) =>
        provider.price >= priceRange[0] && provider.price <= priceRange[1]
    );

    // Availability filter
    if (selectedAvailability) {
      filtered = filtered.filter((provider) =>
        provider.availability?.some((slot) =>
          slot.toLowerCase().includes(selectedAvailability.toLowerCase())
        )
      );
    }

    // Time slot filter
    if (selectedTimeSlot) {
      filtered = filtered.filter((provider) =>
        provider.timeSlots.includes(selectedTimeSlot)
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        filtered.sort((a, b) => b.review_count - a.review_count);
        break;
      default: // recommended
        filtered.sort(
          (a, b) => b.rating * b.review_count - a.rating * a.review_count
        );
    }

    setFilteredProviders(filtered);
  }, [
    providers,
    searchQuery,
    sortBy,
    selectedAvailability,
    selectedTimeSlot,
    priceRange,
  ]);

  // Load data on mount
  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <Navbar />
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for services provider or services"
              className="pl-10 pr-4 py-3 w-full rounded-full border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full bg-orange-500 hover:bg-orange-600">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-80 space-y-6">
            {/* Sort */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Sorted by:</h3>
                </div>
              </CardHeader>
              <CardContent>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Time of Day */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="font-semibold">Time of day</h3>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedTimeSlot}
                  onValueChange={setSelectedTimeSlot}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="morning" id="morning" />
                    <Label htmlFor="morning" className="text-sm">
                      Morning (6am - 12pm)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="afternoon" id="afternoon" />
                    <Label htmlFor="afternoon" className="text-sm">
                      Afternoon (12pm - 6pm)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="evening" id="evening" />
                    <Label htmlFor="evening" className="text-sm">
                      Evening (6pm - 12am)
                    </Label>
                  </div>
                </RadioGroup>
                <div className="mt-3">
                  <Button
                    variant="link"
                    className="p-0 text-sm text-orange-600"
                  >
                    Choose a specific time
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Price Range */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="font-semibold">Price</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GH₵ {priceRange[0]}</span>
                  <span>GH₵ {priceRange[1]}</span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GH₵ 0</span>
                  <span>GH₵ 2000+</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Above fees cover all that offered services. Provided webdings
                  do deal external fees beyond handyhive.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">
                Browse Service Providers and Prices
              </h1>
              <p className="text-gray-600">
                {filteredProviders?.length} providers found
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-6">
                {filteredProviders?.map((provider) => (
                    // console.log(provider)
                  <Card key={provider.id} className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {provider.full_name.charAt(0)}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {provider.full_name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                {provider.verified && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    ✓ Approved Pro
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                                  <span className="text-sm font-medium">
                                    {provider.rating}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    ({provider.review_count})
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {provider.completed_projects} completed projects
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">
                                GH₵{provider.price}
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium text-sm mb-1">
                              How I can help:
                            </h4>
                            <p className="text-sm text-gray-600">
                              {provider.bio}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                                onClick={() => {
                                  /* Handle contact */
                                }}
                              >
                                Select & Continue
                              </Button>
                            </div>
                            <div className="text-sm text-gray-500">
                              View profile & past reviews
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredProviders?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No services providers found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderSearch;
