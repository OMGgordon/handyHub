"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface DatePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (dateTimes: string[]) => void; // always array of ISO strings
}

export default function DatePickerModal({
  open,
  onOpenChange,
  onConfirm,
}: DatePickerModalProps) {
  const [selectedTime, setSelectedTime] = useState("3:00pm");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const timeOptions = [
    "9:00am",
    "10:00am",
    "11:00am",
    "12:00pm",
    "1:00pm",
    "2:00pm",
    "3:00pm",
    "4:00pm",
    "5:00pm",
  ];

  const bookedDates = Array.from(
    { length: 12 },
    (_, i) => new Date(2025, 5, 15 + i)
  );

  const parseTime = (timeStr: string): [number, number] => {
    const [time, period] = timeStr.split(/(?=[ap]m)/);
    const [hours, minutes] = time.split(":").map(Number);
    let hour24 = hours;
    if (period === "pm" && hours !== 12) hour24 += 12;
    if (period === "am" && hours === 12) hour24 = 0;
    return [hour24, minutes || 0];
  };

  const handleConfirm = () => {
    if (!dateRange?.from || !dateRange?.to) return;

    const [hour, minute] = parseTime(selectedTime);
    const days: string[] = [];

    let current = new Date(dateRange.from);
    while (current <= dateRange.to) {
      const date = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate(),
        hour,
        minute
      );
      days.push(date.toISOString());
      current.setDate(current.getDate() + 1);
    }

    onConfirm(days);
    onOpenChange(false);

    // Reset
    setDateRange(undefined);
    setSelectedTime("3:00pm");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        {/* Wrapper: stack on mobile, side by side on large */}
        <div className="flex flex-col lg:flex-row">
          {/* Calendar Section */}
          <div className="flex-1 p-6 sm:p-8 lg:p-12">
            <DialogHeader className="mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-400 mr-4 overflow-hidden">
                  <img
                    src="/professional-headshot-of-a-person-in-yellow-shirt.jpg"
                    alt="Mensah"
                    className="w-full h-full object-cover"
                  />
                </div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Mensah&apos;s Availability
                </DialogTitle>
              </div>
            </DialogHeader>

            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              disabled={bookedDates}
              modifiers={{ booked: bookedDates }}
              modifiersClassNames={{
                booked: "[&>button]:line-through opacity-100",
              }}
              className="rounded-lg border shadow-sm mb-6"
              excludeDisabled
            />

            <div className="relative">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-full appearance-none bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA629] focus:border-transparent"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <p className="text-xs text-gray-500 mt-4">
              You can chat to adjust task details or change start time after
              confirming.
            </p>
          </div>

          {/* Confirmation Section */}
          <div className="w-full lg:w-80 bg-gray-50 p-6 border-t lg:border-t-0 lg:border-l">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Request for:
              </h3>
              <p className="text-base sm:text-lg font-bold text-gray-900">
                {dateRange?.from && dateRange?.to
                  ? `${dateRange.from.toDateString()} → ${dateRange.to.toDateString()} (${selectedTime})`
                  : "Select a date range"}
              </p>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!dateRange?.from || !dateRange?.to}
              className="w-full bg-[#FFA629] hover:bg-[#ff9500] text-black hover:text-black font-medium py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
