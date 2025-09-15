"use client";

import * as React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Popover, PopoverTrigger, PopoverContent } from "././ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface LocationInputProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function LocationInput({ formData, setFormData }: LocationInputProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const [open, setOpen] = React.useState(false);

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    setOpen(false);

    // optional: get lat/lng from Google
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);

    setFormData((prev: any) => ({
      ...prev,
      workLocation: address,
      coordinates: { lat, lng },
    }));
  };

  return (
    <div>
      <Label
        htmlFor="workLocation"
        className="text-sm font-medium text-gray-700"
      >
        Work Location
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-start mt-1 bg-white"
          >
            {formData.workLocation || "Enter your work location"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search location..."
              value={value}
              onValueChange={(val) => setValue(val)}
            disabled={!ready}
            />
            <CommandList>
              <CommandEmpty>No locations found.</CommandEmpty>
              {status === "OK" &&
                data.map(({ place_id, description }) => (
                  <CommandItem
                    key={place_id}
                    value={description}
                    onSelect={() => handleSelect(description)}
                  >
                    {description}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
