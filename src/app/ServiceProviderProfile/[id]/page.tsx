"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";
import { format } from "date-fns";
import { Star, CheckCircle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ServiceProviderProfile() {
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const router = useRouter();
  const params = useParams();
  const providerId = params.id as string;

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchProvider = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .eq("id", providerId)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setProvider(data);
      }
      setLoading(false);
    };

    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("reviewer_name, rating, date, category, description")
        .eq("provider_id", providerId);

      if (error) {
        console.error("Error fetching reviews:", error.message);
      } else {
        setReviews(data || []);
      }
    };

    if (providerId) fetchProvider();
    fetchReviews();
  }, [providerId]);

  if (loading) return <p>Loading provider profile...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!provider) return <p>No provider found</p>;

  console.log(provider);
  // const reviews = [
  //   {
  //     id: 1,
  //     reviewer_name: "Sheila S.",
  //     date: "03/2025",
  //     rating: 1,
  //     category: "plumbing",
  //     desc: "Over charged my father for a backwater valve repair gave him an invoice with no specific breakdown on the job that was done. Had to request for a breakdown invoice Charged him $4k for a 4 hour job that was not done properly as the basement re flooded again. Gave me a run around for 3 weeks to get a…",
  //   },
  //   {
  //     id: 2,
  //     name: "james G.",
  //     date: "11/2024",
  //     rating: 1,
  //     category: "plumbing",
  //     text: "i was visiting my wife in boston and noticed she had a small leak under bathroom cabinet when i looked it was a plastic fitting on the drain line leaking i had no tools and was leaving the next day and didnt want to leave her with the problem i called super service and they were here the next day quoted me a…",
  //   },
  //   {
  //     id: 3,
  //     name: "Sharon B.",
  //     date: "10/2024",
  //     rating: 5,
  //     category: "plumbing",
  //     text: "We had a toilet that was running and requested service. C.J. called in advance to let me know he was on his way and arrived right on time. He noticed that in addition to the toilet running, it also had a small leak. It was very apparent once he pointed it out. He gave me two options with pricing. He did a GREAT…",
  //   },
  //   {
  //     id: 4,
  //     name: "Giovanna P.",
  //     date: "05/2024",
  //     rating: 5,
  //     category: "heating & air conditioning/hvac",
  //     text: "Yes ,I am pleased with their work and upfront pricing.",
  //   },
  //   {
  //     id: 5,
  //     name: "Patricia M.",
  //     date: "03/2024",
  //     rating: 5,
  //     category: "water heater repair",
  //     text: "We called early afternoon to see if someone could come out to evaluate our water heater which water temperature was hot & cold over the weekend, someone was at the house in an hour, Tom Ripley was excellent had the problem solved and a new water heater installed within a few hours. Tom was pleasa…",
  //   },
  // ];

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? "fill-[#fe9f2b] text-[#fe9f2b]"
                : "fill-[#d8d9d4] text-[#d8d9d4]"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="space-y-8">
            {/* About Us */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {showFullAbout
                    ? provider?.bio
                    : provider?.bio?.length > 180
                    ? provider?.bio?.slice(0, 180) + "…"
                    : provider?.bio}
                </p>
                {provider?.bio && provider?.bio?.length > 180 && (
                  <Button
                    variant="link"
                    className="px-0 text-gray-700 underline"
                    onClick={() => setShowFullAbout(!showFullAbout)}
                  >
                    {showFullAbout ? "Read less" : "Read more"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Business Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Business highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-700" />
                  <span>
                    {provider.years_experience} years of trusted experience
                  </span>
                </div>
                {provider.highlights && provider.highlights.length > 0 && (
                  <>
                    {provider.highlights.map(
                      (highlight: string, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-gray-700" />
                          <span>{highlight}</span>
                        </div>
                      )
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            <div className=" gap-6">
              {provider?.services && provider?.services?.length !== 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Services offered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {provider?.services.join(", ")}
                    </p>
                    {provider?.services?.length > 50 && (
                      <Button
                        variant="link"
                        className="px-0 text-gray-700 underline"
                      >
                        Read more
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Pricing Information */}
              {(provider.price || provider.pricing_notes) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {provider.price && (
                      <p className="text-gray-700 mb-2">
                        <span className="font-semibold">Starting Rate:</span>{" "}
                        GH₵{provider.price}
                      </p>
                    )}
                    {provider.pricing_notes && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Notes:</span>{" "}
                        {provider.pricing_notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* <Card>
                <CardHeader>
                  <CardTitle>Services not offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Paving, Landscaping, Sod or Fill, HVAC Services, AC
                    Services, Carpentry, Painting,…
                  </p>
                  <Button
                    variant="link"
                    className="px-0 text-gray-700 underline"
                  >
                    Read more
                  </Button>
                </CardContent>
              </Card> */}
            </div>

            {/* Amenities & Payment Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {provider?.amenities && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities Provided</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(provider?.amenities).map(([key, value]) => (
                      <div key={key} className="">
                        <h4 className="font-medium capitalize">
                          {key.replace("_", " ")}
                        </h4>
                        <p className="text-gray-600 font-light">
                          {String(value)}
                        </p>
                      </div>
                    ))}
                    {/* {provider.amenities.map((amenity) => {
                      <div>
                        <h4 className="font-medium">{amenities[amenity]}</h4>
                        <p className="text-gray-600">Yes</p>
                      </div>;
                    })} */}
                  </CardContent>
                </Card>
              )}

              {provider?.payment_methods && (
                <Card>
                  <CardHeader>
                    <CardTitle>Accepted payment methods</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {provider.payment_methods.map((method: string) => (
                      <div key={method} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{method}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case "photos":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Photos of past projects</CardTitle>
            </CardHeader>
            <CardContent>
              {provider.portfolio_images &&
              provider.portfolio_images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {provider.portfolio_images.map(
                    (image: any, index: number) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={image.url}
                          alt={image.caption || `Project ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No portfolio images available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "reviews":
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              {/* <Button className="bg-[#fe9f2b] hover:bg-[#e8891a] text-white">
      Write a review
    </Button> */}
            </CardHeader>
            <CardContent className="space-y-6">
              {reviews?.map((review) => {
                const MAX_LENGTH = 180; // characters before truncating

                const textToShow =
                  !expanded && review.description.length > MAX_LENGTH
                    ? review.description.slice(0, MAX_LENGTH) + "…"
                    : review.description;

                return (
                  <div
                    key={review.id}
                    className="border-b pb-6 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{review.reviewer_name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm font-medium">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(review.date), "MMM d, yyyy")}
                      </span>
                    </div>

                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground mb-3 capitalize">
                      {review.category}
                    </div>

                    <div className="bg-white text-gray-700 px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-semibold border border-gray-400 mb-3 w-fit">
                      <Image
                        src="/logoonly.png"
                        alt="HandyHive Logo"
                        width={12}
                        height={12}
                        className="w-3 h-3"
                      />
                      Approved Review
                    </div>

                    <p className="text-gray-700 mb-4">{textToShow}</p>

                    {review.description.length > MAX_LENGTH && (
                      <Button
                        variant="link"
                        className="px-0 text-gray-700 underline"
                        onClick={() => setExpanded(!expanded)}
                      >
                        {expanded ? "See less" : "See full review"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );

      case "more":
        return (
          <div className="space-y-6">
            {/* Licensing */}
            <Card>
              <CardHeader>
                <CardTitle>Licensing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {provider.has_insurance && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Insured</span>
                    </div>
                  )}
                  {provider.has_license && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Licensed</span>
                    </div>
                  )}
                  {!provider.has_insurance && !provider.has_license && (
                    <p className="text-gray-500">
                      No licensing information provided.
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  All statements concerning insurance, licenses, and bonds are
                  informational only, and are self-reported. Since insurance,
                  licenses and bonds can expire and can be cancelled, homeowners
                  should always check such information for themselves.
                </p>
              </CardContent>
            </Card>

            {/* Service Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Service Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {provider.services?.join(", ") ||
                    provider.service_category.join(", ")}
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Use AuthenticatedNavbar for service provider pages */}
      <AuthenticatedNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex-1 w-full sm:w-auto">
                <div className="mb-3">
                  <div className=" text-gray-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-semibold   w-fit">
                    {/* {provider.avatar ? (
                      <Image
                        src={provider.avatar}
                        alt="HandyHive Logo"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    ) : (
                      <div className="w-16 mb-0 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm sm:text-lg">
                          {provider.full_name.charAt(0)}
                        </span>
                      </div>
                    )} */}
                    {/* Approved Pro */}
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {provider.full_name}
                </h1>
                {provider.online && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 bg-green-400 mb-2"
                  >
                    Online
                  </Badge>
                )}
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(provider.rating)}
                  <span className="font-medium text-gray-800">
                    {provider.rating}
                  </span>
                  <span className="text-gray-600">
                    ({provider.review_count})
                  </span>
                </div>
                <p className="text-gray-700 mb-3 capitalize text-sm sm:text-base">
                  {provider.service_category?.join(", ")}
                </p>
                {/* <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Phone className="w-4 h-4" />
                  View phone number
                </Button> */}
              </div>
              <div className="relative w-full flex-col sm:w-auto flex justify-center sm:justify-end sm:-ml-16 sm:pr-25">
                {provider?.avatar ? (
                  <Image
                    src={provider?.avatar || "/profile.png"}
                    alt="provider picture"
                    width={16}
                    height={16}
                    className="w-16 mb-0 h-16 sm:w-30 sm:h-30"
                  />
                ) : (
                  <div className="w-16 mb-0 h-16 sm:w-30 sm:h-30 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-lg">
                      {provider.full_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Tabs */}
            <div className="w-full">
              <div className="flex w-full border-b overflow-x-auto">
                {["about", "photos", "reviews", "more"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-0 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? "border-[#fe9f2b] text-[#fe9f2b]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="mt-4 sm:mt-6">{renderTabContent()}</div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <Card className="sticky top-2 sm:top-4 lg:top-6">
              <CardContent className="p-3 space-y-3">
                <Button
                  onClick={() => {
                    router.push(`/job-details/${provider.id}`);
                  }}
                  className="w-full bg-[#fe9f2b] hover:bg-[#e8891a] text-white py-3 sm:py-4 text-sm sm:text-base border-2 border-[#C26E09]"
                >
                  BOOK
                </Button>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    Contact information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm break-words">
                        {provider.location}
                      </span>
                    </div>
                    <Button
                      variant="link"
                      className="px-0 text-xs sm:text-sm underline"
                    >
                      {provider.phone_number}
                    </Button>
                  </div>
                </div>

                {provider?.service_hours &&
                  Object.keys(provider.service_hours).length > 0 && (
                    <div>
                      <Separator />

                      <div>
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">
                          Service hours
                        </h3>
                        <div className="space-y-1 text-xs">
                          {Object.entries(provider.service_hours).map(
                            ([day, hours]: [string, any]) =>
                              hours.available && (
                                <div
                                  key={day}
                                  className="text-gray-700 flex justify-between font-semibold"
                                >
                                  <span>{day}</span>
                                  <span>
                                    {hours.start} - {hours.end}
                                  </span>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
