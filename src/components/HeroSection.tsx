import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-[300px] sm:h-[400px] lg:h-[474px] mx-4 sm:mx-6 mt-2 rounded-[15px] sm:rounded-[20px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover sm:bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/herosection.png')" }}
      />
      
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-8 lg:px-16">
        <div className="max-w-2xl">
          <div className="bg-white/20 backdrop-blur-sm rounded-[8px] sm:rounded-[10px] p-4 sm:p-6 lg:p-8 xl:p-12">
            <h1 className="text-[20px] sm:text-[24px] md:text-[32px] lg:text-[40px] font-bold text-black leading-tight mb-4 sm:mb-6 lg:mb-8">
              Find certified, <span className="text-[#fe9f2b]">reliable</span> service providers in your area.
            </h1>
            
            <div className="relative">
              <div className="flex items-center bg-white rounded-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 shadow-lg">
                <Input 
                  placeholder="Search for service/ service providers"
                  className="border-0 bg-transparent text-[10px] sm:text-[12px] text-black/50 flex-1 focus-visible:ring-0"
                />
                <Button 
                  size="sm" 
                  className="bg-[#fe9f2b] hover:bg-[#e8891a] rounded-full w-6 h-6 sm:w-8 sm:h-8 p-0 ml-1 sm:ml-2"
                >
                  <Search className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}