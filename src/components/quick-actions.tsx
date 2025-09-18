import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, User, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export function QuickActions({ providerId }: { providerId: string }) {
  const [online, setOnline] = useState<boolean>(false);
  const [availability, setAvailability] = useState<Date[]>([]);
  const router = useRouter();

  // fetch initial online status
  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select("online")
        .eq("id", providerId)
        .single();

      if (!error && data) setOnline(data.online);
    };

    if (providerId) fetchStatus();
  }, [providerId]);

  const toggleOnline = async () => {
    const { error } = await supabase
      .from("service_providers")
      .update({ online: !online })
      .eq("id", providerId);

    if (!error) {
      setOnline(!online); // update local state only if DB update succeeds
    } else {
      console.error("Failed to toggle online:", error);
    }
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Action</h3>

      <div className="space-y-4">
        <Button
          onClick={toggleOnline}
          className={`w-full ${
            online
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white py-3 flex items-center justify-center gap-2`}
        >
          <Wifi className="w-4 h-4" />
          {online ? "Go Offline" : "Go Online"}
        </Button>

        {/* <Button
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 flex items-center justify-center gap-2 bg-transparent"
        >
          <Calendar className="w-4 h-4" />
          Set Availability
        </Button> */}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 flex items-center justify-center gap-2 bg-transparent"
            >
              <CalendarIcon className="w-4 h-4" />
              Set Availability
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <Calendar
              mode="multiple"
              selected={availability}
              onSelect={(days) => days}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          onClick={() => router.push("/profile-update")}
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 flex items-center justify-center gap-2 bg-transparent"
        >
          <User className="w-4 h-4" />
          Update Profile
        </Button>
      </div>
    </Card>
  );
}
