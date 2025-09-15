import { useRouter } from "next/navigation";

const categories = [
  { name: "Handyperson", icon: "/images/handyperson.png" },
  { name: "Landscaping", icon: "/images/landscaping.png" },
  { name: "Plumbing", icon: "/images/plumbingcs.png" },
  { name: "Electrical", icon: "/images/electrical.png" },
  { name: "Remodeling", icon: "/images/remodeling.png" },
  { name: "Roofing", icon: "/images/roofingcs.png" },
  { name: "Painting", icon: "/images/painting.png" },
  { name: "Cleaning", icon: "/images/cleaning.png" },
  { name: "HVAC", icon: "/images/hvac.png" },
  { name: "Windows", icon: "/images/windows.png" },
  { name: "Concrete", icon: "/images/concrete.png" },
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
              <img
                src={category.icon}
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
