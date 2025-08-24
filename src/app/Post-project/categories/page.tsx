"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";

const categories = [
  "Additions & Remodels",
  "Air Conditioning & Cooling", 
  "Builders (New Homes), Architects & Designers",
  "Bathroom",
  "Cabinets & Countertops",
  "Carpentry",
  "Carpet",
  "Cleaning Services",
  "Concrete, Brick & Stone",
  "Decks, Porches, Gazebos & Play Equipment",
  "Decorators & Designers",
  "Driveways, Patios, Walks, Steps & Floors",
  "Drywall & Insulation",
  "Electrical, Telephone & Computers",
  "Fences",
  "Flooring",
  "Foundations",
  "Garages, Doors, Openers",
  "Gutters",
  "Handyman Services",
  "Heating & Cooling",
  "Kitchen",
  "Landscape, Decks & Fences",
  "Maintenance of Lawn, Trees & Shrubs",
  "Painting & Staining",
  "Plumbing",
  "Roofing, Siding & Gutters",
  "Siding",
  "Swimming Pools, Spas, Hot Tubs & Saunas",
  "Tile & Stone",
  "Walls & Ceilings",
  "Windows & Doors"
];

export default function CategoriesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    router.push("/Post-project/location");
  };

  const handleCategorySelect = () => {
    router.push("/Post-project/location");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <AuthenticatedNavbar />

      {/* Search Section */}
      <div className="bg-[#faf0df] py-8">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-white rounded-lg p-5 flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="What can we help you with today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 text-lg placeholder:text-gray-500 focus-visible:ring-0"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-[rgba(254,159,43,1)] hover:bg-orange-600 px-8 py-3 text-white font-semibold rounded-lg"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Popular categories</h2>
          <div className="w-full h-px bg-gray-800 mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={handleCategorySelect}
                className="text-[rgba(254,159,43,1)] hover:text-orange-600 text-left transition-colors duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
