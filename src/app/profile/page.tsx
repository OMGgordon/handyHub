"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/context/SessionProvider";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AuthenticatedNavbar } from "@/components/AuthenticatedNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { 
  Edit, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  CheckCircle,
  Award,
  Clock,
  User
} from "lucide-react";

interface ServiceProvider {
  id: string;
  full_name: string;
  phone?: string;
  bio: string;
  avatar?: string;
  service_category: string[];
  services?: string[];
  location: string;
  service_area?: string;
  price: number;
  pricing_notes?: string;
  years_experience?: number;
  highlights?: string[];
  service_hours?: {
    [key: string]: { start: string; end: string; available: boolean };
  };
  payment_methods?: string[];
  email?: string;
  has_license?: boolean;
  has_insurance?: boolean;
  certificates?: string[];
  portfolio_images?: { url: string; caption: string }[];
  rating: number;
  review_count: number;
  verified: boolean;
  completed_projects: number;
  created_at: string;
  updated_at?: string;
}

export default function HandymanProfilePage() {
  const { session, loading: sessionLoading } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Wait for session to load before checking authentication
      if (sessionLoading) return;
      
      if (!session?.user?.id) {
        router.push('/auth');
        return;
      }

      console.log('Current user ID:', session.user.id);
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('service_providers')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log('Profile data:', data);
        console.log('Profile error:', error);

        if (error) {
          console.error('Detailed error:', error);
          if (error.code === 'PGRST116') {
            // No record found - user is not a service provider
            setError('You are not registered as a service provider.');
          } else if (error.code === '42703') {
            // Column doesn't exist error
            setError('Database schema error. Please contact support.');
          } else {
            setError(error.message);
          }
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user?.id, sessionLoading, router]);

  const handleEditProfile = () => {
    router.push('/profile-update');
  };

  // Show loading while session is being fetched
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#fff7e7]">
        <AuthenticatedNavbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe9f2b] mx-auto"></div>
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff7e7]">
        <AuthenticatedNavbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fff7e7]">
        <AuthenticatedNavbar />
        <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
          <p className="text-lg text-red-600">{error}</p>
          <Button onClick={() => router.push('/profile-update')}>
            Complete Your Profile Setup
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#fff7e7]">
        <AuthenticatedNavbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-lg">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7e7]">
      <AuthenticatedNavbar />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your service provider profile</p>
          </div>
          <Button 
            onClick={handleEditProfile}
            className="bg-[#fe9f2b] hover:bg-[#e8912a] text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Overview Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.full_name}
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-30 h-30 bg-[#fe9f2b] rounded-full flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{profile.full_name}</h2>
                  {profile.verified && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                  <Badge className="bg-green-600 hover:bg-green-700 text-white">
                    Approved
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-medium">{profile.rating}</span>
                    <span className="text-gray-600">({profile.review_count} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-5 h-5 text-[#fe9f2b]" />
                    <span>{profile.completed_projects} projects completed</span>
                  </div>
                </div>

                {/* Service Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.service_category?.map((category, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#fe9f2b] text-white">
                      {category}
                    </Badge>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {profile.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>Starting from GH₵{profile.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {profile.bio || "No bio provided yet."}
              </p>
              
              {profile.years_experience && (
                <div className="mt-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#fe9f2b]" />
                  <span className="font-medium">{profile.years_experience} years of experience</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.services && profile.services.length > 0 ? (
                <div className="space-y-2">
                  {profile.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No specific services listed yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Business Highlights */}
          {profile.highlights && profile.highlights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Business Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#fe9f2b]" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Methods */}
          {profile.payment_methods && profile.payment_methods.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Accepted Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.payment_methods.map((method, index) => (
                    <Badge key={index} variant="outline">
                      {method}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service Hours */}
          {profile.service_hours && Object.keys(profile.service_hours).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Service Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(profile.service_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium capitalize">{day}</span>
                      <span className="text-sm">
                        {hours.available 
                          ? `${hours.start} - ${hours.end}`
                          : 'Closed'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service Area */}
          {profile.service_area && (
            <Card>
              <CardHeader>
                <CardTitle>Service Area</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#fe9f2b]" />
                  <span className="text-lg">{profile.service_area}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Notes */}
          {profile.pricing_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <DollarSign className="w-5 h-5 text-[#fe9f2b] mt-0.5" />
                  <div>
                    <p className="font-medium mb-2">Starting Rate: GH₵{profile.price}</p>
                    <p className="text-gray-700">{profile.pricing_notes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Certifications & Licenses Section */}
        {((profile.has_license || profile.has_insurance) || (profile.certificates && profile.certificates.length > 0)) && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Certifications & Licenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* License and Insurance Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className={`w-5 h-5 ${profile.has_license ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={profile.has_license ? 'text-green-700 font-medium' : 'text-gray-500'}>
                      Professional License {profile.has_license ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className={`w-5 h-5 ${profile.has_insurance ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={profile.has_insurance ? 'text-green-700 font-medium' : 'text-gray-500'}>
                      Insurance Coverage {profile.has_insurance ? 'Active' : 'Not Active'}
                    </span>
                  </div>
                </div>

                {/* Certificates */}
                {profile.certificates && profile.certificates.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Professional Certificates</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.certificates.map((certificate, index) => (
                        <Badge key={index} variant="outline" className="border-[#fe9f2b] text-[#fe9f2b]">
                          <Award className="w-3 h-3 mr-1" />
                          {certificate}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Section */}
        {profile.portfolio_images && profile.portfolio_images.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile.portfolio_images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.caption || `Portfolio image ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Profile Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-[#fe9f2b]">{profile.rating}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#fe9f2b]">{profile.review_count}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#fe9f2b]">{profile.completed_projects}</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#fe9f2b]">
                  {profile.verified ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-600">Verified Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Last Updated */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Profile created on {new Date(profile.created_at).toLocaleDateString()}
          {profile.updated_at && (
            <span> • Last updated {new Date(profile.updated_at).toLocaleDateString()}</span>
          )}
        </div>

      </div>
    </div>
  );
}