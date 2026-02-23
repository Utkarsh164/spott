"use client";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/convex/_generated/api";
import { City, State } from "country-state-city";
import UpgradeModal from "@/components/upgrade-modal";
import Image from "next/image";
import { UnsplashImagePicker } from "@/components/unsplash-image-picker";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Crown, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters longs"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters longs"),
  category: z.string().min(1, "Category must be at least 3 characters long"),

  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string().regex(timeRegex, "Start tiem must be HH:MM"),
  endTime: z.string().regex(timeRegex, "End tiem must be HH:MM"),

  locationType: z.enum(["physical", "online"]).default("physical"),
  venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),

  capacity: z.number().min(1, "Capacity must be at least 1"),
  ticketType: z.enum(["free", "paid"]).default("free"),
  ticketPrice: z.number().optional(),
  coverImage: z.string().optional(),
  themeColor: z.string().default("#1c1c1c"),
});

const CreateEvents = () => {
  const router = useRouter();

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("limit");

  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const { mutate: createEvent, isLoading } = useConvexMutation(
    api.events.createEvent,
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      locationType: "physical",
      ticketType: "free",
      capacity: 50,
      themeColor: "#1c1c1c",
      category: "",
      state: "",
      city: "",
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = () => {
    console.log("Got Submit");
  };

  const themeColor = watch("themeColor");
  const ticketType = watch("ticketType");
  const selectedState = watch("state");
  const coverImage = watch("coverImage");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const indianStates = useMemo(() => State.getStatesOfCountry("IN"), []);

  const cities = useMemo(() => {
    if (!selectedState) return [];

    const st = indianStates.find((s) => s.name === selectedState);
    if (!st) return [];
    return City.getCitiesOfState("IN", st.isoCode);
  }, [selectedState, indianStates]);

  const colorPresets = [
    "#1c1c1c",
    ...(hasPro ? ["#2e1065", "#064e3b", "#3b0764", "#5f1111", "#701a33"] : []),
  ];
  const handleColorClick = (color) => {
    if (color !== "#1c1c1c" && !hasPro) {
      setUpgradeReason("color");
      setShowUpgradeModal(true);
      return;
    }
    setValue("themeColor", color);
  };
  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="min-h-screen transition-colors duration-300 px-6 py-8 -mt-6 md:-mt-16 lg:rounded-md"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-5 md:flex-row justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">Create Event</h1>
          {!hasPro && (
            <p className="text-sm text-muted-foreground mt-2">
              Free: {currentUser?.freeEventsCreated || 0}/1 events created
            </p>
          )}
        </div>
        {/* AI Event Creator */}
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-[320px_1fr] gap-10">
        {/* LEFT */}
        <div className="space-y-6">
          <div
            className="aspect-square w-full rounded-xl overflow-hidden flex items-center justify-center cursor-pointer border border-2"
            onClick={() => setShowImagePicker(true)}
          >
            {coverImage ? (
              <Image
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
                width={500}
                height={500}
              />
            ) : (
              <span>Click to add cover image</span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className={"text-sm"}>Theme Color</Label>
              {!hasPro && (
                <Badge variant={"secondary"} className={"text-xs gap-1"}>
                  <Crown className="w-3 h-3" /> Pro
                </Badge>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    !hasPro && color !== "#1c1c1c"
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:scale-110"
                  }`}
                  style={{
                    background: color,
                    borderColor: themeColor === color ? "white" : "transparent",
                  }}
                  onClick={() => handleColorClick(color)}
                  title={
                    !hasPro && color !== "#1c1c1c"
                      ? "Upgrade to pro for custom colors"
                      : ""
                  }
                />
              ))}

              {!hasPro && (
                <button
                  type="button"
                  onClick={() => {
                    setUpgradeReason("color");
                    setShowUpgradeModal(true);
                  }}
                  className="w-10 h-10 rounded-full border-2 border-dashed border-purple-300 flex
                  items-center justify-center hover:border-purple-500 transition-colors"
                  title="Unlock more colors with pro"
                >
                  <Sparkle className="w-5 h-5 text-purple-400" />
                </button>
              )}
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <Input
              {...register("title")}
              placeholder="Event Name"
              className={
                "text-3xl font-semibold bg-transparent border-none focus-visible:ring-0"
              }
            />
            {errors.title && (
              <p className="text-sm text-red-400 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={"text-sm"}>Start</Label>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => {
                        console.log("it got clicked");
                      }}
                    >
                      {startDate ? format(startDate, "PPP") : "Pick date"}
                      <CalendarIcon className="w-4 h-4 opacity-60" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => setValue("startDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </form>
      </div>

      {showImagePicker && (
        <UnsplashImagePicker
          isOpen={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelect={(url) => {
            setValue("coverImage", url);
          }}
        />
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger={upgradeReason}
      />
    </div>
  );
};

export default CreateEvents;
