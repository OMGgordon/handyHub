import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface Review {
  description: ReactNode;
  reviewer_name: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
}

// const reviews: Review[] = [
//   {
//     name: "Mavis Mavis",
//     date: "Aug 15 2025",
//     rating: 5,
//     comment:
//       "Mensah did an amazing job fixing the tap in my house. He was thorough, efficient, and very professional. I highly recommend him!",
//   },
//   {
//     name: "Mavis Mavis",
//     date: "Aug 15 2025",
//     rating: 5,
//     comment:
//       "Mensah did an amazing job fixing the tap in my house. He was thorough, efficient, and very professional. I highly recommend him!",
//   },
// ];

type Review = {
  id: string;
  provider_id: string;
  reviewer_name: string;
  rating: number;
  date: string;
  category: string;
  description: string;
};

export function RecentReviews({ providerId }: { providerId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("provider_id", providerId)
        .order("date", { ascending: false }); // latest first

      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        setReviews(data as Review[]);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [providerId]);

  if (loading) return <p>Loading reviews...</p>;

  if (reviews.length === 0) return <p>No reviews yet.</p>;
  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Recent Reviews
      </h3>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="flex gap-4">
            <Avatar className="w-10 h-10 bg-gray-200">
              <AvatarFallback className="bg-gray-300 text-gray-600 font-medium">
                {review.reviewer_name[0]
                  }
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{review.reviewer_name}</p>
                  <p className="text-xs text-gray-500">{format(new Date(review.date), "MMM d, yyyy")}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-orange-400 text-orange-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm font-medium text-gray-900">
                    {review.rating}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {review.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
