import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-[474px] mx-6 mt-6 rounded-[20px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/herosection.png')" }}
      />
      
      <div className="relative z-10 flex flex-col justify-center h-full px-8 lg:px-16">
        <div className="max-w-2xl">
          <div className="bg-white/20 backdrop-blur-sm rounded-[10px] p-8 lg:p-12">
            <h1 className="text-[32px] lg:text-[40px] font-bold text-black leading-tight mb-8">
              Find certified, <span className="text-[#fe9f2b]">reliable</span> service providers in your area.
            </h1>
            
            <div className="relative">
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
                <Input 
                  placeholder="Search for service/ service providers"
                  className="border-0 bg-transparent text-[12px] text-black/50 flex-1 focus-visible:ring-0"
                />
                <Button 
                  size="sm" 
                  className="bg-[#fe9f2b] hover:bg-[#e8891a] rounded-full w-8 h-8 p-0 ml-2"
                >
                  <Search className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}