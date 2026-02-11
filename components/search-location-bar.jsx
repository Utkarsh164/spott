"use client";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { City, State } from "country-state-city";
import { Calendar, Loader2, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "./ui/input";
import { debounce } from "lodash";
import { getCategoryIcon } from "@/lib/data";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createLocationSlug } from "@/lib/location-utils";

const SearchLocationBar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const { data: currentUser, isLoading } = useConvexQuery(
    api.users.getCurrentUser,
  );
  const { mutate: updateLocation } = useConvexMutation(
    api.users.completeOnBoarding,
  );

  const { data: searchResult, isLoading: searchLoading } = useConvexQuery(
    api.search.searchEvents,
    searchQuery.trim().length >= 2 ? { query: searchQuery, limit: 5 } : "skip",
  );
  const indianStates = State.getStatesOfCountry("IN");

  const cities = useMemo(() => {
    if (!selectedState) return [];

    const state = indianStates.find((s) => s.name === selectedState);
    if (!state) return [];
    return City.getCitiesOfState("IN", state.isoCode);
  }, [selectedState, indianStates]);

  useEffect(() => {
    if (currentUser?.location) {
      setSelectedState(currentUser?.location?.state || "");
      setSelectedCity(currentUser?.location?.city || "");
    }
  }, [currentUser, isLoading]);

  const debouncedSetQuery = useRef(
    debounce((value) => setSearchQuery(value)),
    3000,
  ).current;
  const handleSearchInput = (e) => {
    const value = e.target.value;
    debouncedSetQuery(value);
    setShowSearchResults(value.length >= 2);
  };

  const handleEventClick = (slug) => {
    setShowSearchResults(false);
    setSearchQuery("");
    router.push(`/events/${slug}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleLocationSelect = async (city, state) => {
    try {
      if (currentUser?.interests && currentUser?.location) {
        await updateLocation({
          location: { city, state, country: "India" },
          interests: currentUser.interests,
        });
      }
      const slug = createLocationSlug(city, state);
      router.push(`/explore/${slug}`);
    } catch (error) {
      console.log("Failed to update Location:", error);
    }
  };
  return (
    <div>
      <div className="relative flex w-full" ref={searchRef}>
        <div className="flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            onFocus={() => {
              if (searchQuery.length >= 2) setShowSearchResults(true);
            }}
            onChange={handleSearchInput}
            className={"pl-10 w-full h-9 rounded-none rounded-l-md"}
          />
        </div>
        {showSearchResults && (
          <div className="absolute top-full mt-2 w-96 bg-background border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
            {searchLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
              </div>
            ) : searchResult && searchResult.length > 0 ? (
              <div className="py-2">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                  SEARCH RESULT
                </p>
                {searchResult.map((event) => (
                  <button
                    key={event.id}
                    className="w-full px-4 py-3 hover:bg-muted/50 text-left transition-colors "
                    onClick={() => handleEventClick(event.slug)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl mt-0.5">
                        {getCategoryIcon(event.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-1 line-clamp-1">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(event.startDate, "MMM dd")}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.city}
                          </span>
                        </div>
                      </div>
                      {event.ticketType === "free" && (
                        <Badge className="text-xs" variant="secondary">
                          Free
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}

        <Select
          value={selectedState}
          onValueChange={(value) => {
            setSelectedState(value);
            setSelectedCity("");
          }}
        >
          <SelectTrigger className="w-32 h-9 border-l-0 rounded-none">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4}>
            {indianStates.map((state) => (
              <SelectItem key={state.isoCode} value={state.name}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedCity}
          onValueChange={(value) => {
            setSelectedCity(value);
            if (value && selectedState) {
              handleLocationSelect(value, selectedState);
            }
          }}
          disabled={!selectedState}
        >
          <SelectTrigger className="w-32 h-9 rounded-none rounded-r-md">
            <SelectValue placeholder={"City"} />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4}>
            {cities.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchLocationBar;
