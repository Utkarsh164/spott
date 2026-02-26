"use client";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { Calendar, Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const EventPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { data: event, isLoading } = useConvexQuery(api.events.getEventBySlug, {
    slug: params.slug,
  });
  const { data: registration } = useConvexQuery(
    api.registrations.checkRegistration,
    event?._id ? { eventId: event._id } : "skip",
  );
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }
  if (!event) {
    notFound();
  }
  return (
    <div
      style={{ background: event.themeColor || "#1c1c1c" }}
      className="min-h-screen max-w-screen py-8 -mt-6 lg:-mx-5"
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-8">
          <Badge className={"mb-3"} variant={"secondary"}>
            {getCategoryIcon(event.category)} {getCategoryLabel(event.category)}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className={"w-5 h-5"} />
              <span>{format(event.startDate, "EEEE, MMMM dd, yyyy")}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                {format(event.startDate, "h:mm a")} -{" "}
                {format(event.endDate, "h:mm a")}
              </span>
            </div>
          </div>
        </div>
        {event.coverImage && (
          <div className="relative h-[250px] md:h-[400px] rounded-2xl overflow-hidden mb-6">
            <Image
              src={event.coverImage}
              fill
              alt={event.title}
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="grid lg:grid-col-[1fr_380px] gap-8">
          <div className="space-y-8"></div>
          <div className="lg:sticky lg:top-24 h-fit"></div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
