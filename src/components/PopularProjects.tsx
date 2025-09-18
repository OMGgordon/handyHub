import { Card, CardContent } from "./ui/card";
import { Star } from "lucide-react";

const projects = [
  {
    title: "Handyperson for Small Projects",
    rating: "4.6",
    reviews: "599k+",
    price: "from ₵500",
    image: "/handyman.png",
  },
  {
    title: "One-time Cleaning Service",
    rating: "4.5",
    reviews: "314k+",
    price: "from ₵300",
    image: "/cleaaning.png",
  },
  {
    title: "Air Conditioning Service & Repair",
    rating: "4.7",
    reviews: "306k+",
    price: "from ₵700",
    image: "/ac-repair.png",
  },
  {
    title: "Faucet & Plumbing Repair Services",
    rating: "4.6",
    reviews: "568k+",
    price: "from ₵500",
    image: "/plumbing.png",
  },
  {
    title: "Roof Installation & Repair",
    rating: "4.7",
    reviews: "325k+",
    price: "from ₵700",
    image: "/roofing.png",
  },
  {
    title: "Bathroom Remodel",
    rating: "4.4",
    reviews: "180k+",
    price: "from ₵2,500",
    image: "/bathroom-remodel.png",
  },
];

export function PopularProjects() {
  return (
    <section className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[23.25px] font-bold text-[#282827] mb-8">
          Popular home projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="overflow-hidden border-[#dbd9d4] rounded-[3.907px] hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="p-4 border-b border-[#dbd9d4]">
                <div className="flex items-start gap-3">
                  <Star className="w-4 h-4 text-black mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-[14px] text-[#282827] font-medium leading-tight mb-2">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-[#282827]">
                      <span>
                        {project.rating} ({project.reviews})
                      </span>
                      <span>|</span>
                      <span>{project.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-0">
                <div className="h-[316px] relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
