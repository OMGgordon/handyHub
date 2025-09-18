import Image from "next/image";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Handyperson", icon: "/Handyperson.png" },
  { name: "Landscaping", icon: "/Landscaping.png" },
  { name: "Plumbing", icon: "/Plumbingcs.png" },
  { name: "Electrical", icon: "/Electrical.png" },
  { name: "Remodeling", icon: "/Remodeling.png" },
  { name: "Roofing", icon: "/Roofingcs.png" },
  { name: "Painting", icon: "/Painting.png" },
  { name: "Cleaning", icon: "/Cleaning.png" },
  { name: "HVAC", icon: "/HVAC.png" },
  { name: "Windows", icon: "/Windows.png" },
  { name: "Concrete", icon: "/Concrete.png" },
];

export function ServiceCategories() {
  const router = useRouter();
  return (
    <section className="py-6 px-6 mb-20">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-4 max-w-7xl mx-auto">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => router.push("/search-page")}
          >
            <div className="w-12 h-12 mb-3 flex items-center justify-center">
              <Image
                src={category.icon}
                width={50}
                height={50}
                alt={category.name}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[13px] text-[#282827] text-center leading-tight">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
