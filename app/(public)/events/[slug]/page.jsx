"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Share2,
  Ticket,
  Users,
} from "lucide-react";
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

  const handleShare = async () => {
  const shareData = {
    title: event.title,
    text: event.description,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast.success("Link copied to clipboard!");
    }
  } catch (error) {
    console.error("Share failed:", error);
  }
};
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
      className="min-h-screen max-w-screen py-8 -mt-6 md:-mt-16 lg:-mx-5"
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

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left */}
          <div className="space-y-8 flex flex-col">
            <Card className={"pt-0"}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className=" whitespace-pre-wrap leading-relaxed text-muted-foreground mb-0.5">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            <Card className={"pt-0"}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-1">
                  <MapPin className="w-6 h-6 text-purple-500" /> Location
                </h2>
                <p className=" whitespace-pre-wrap leading-relaxed font-semibold mb-2">
                  {`${event?.city}, ${event?.state || event?.country}`}
                </p>

                {event.address && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.address}
                  </p>
                )}

                {event.venue && (
                  <Button variant="outline" asChild>
                    <a
                      href={event.venue}
                      target="_blank"
                      className="flex items-center hover:text-purple-200 gap-2"
                      rel="noopener noreferrer"
                    >
                      View on Map <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className={"pt-0"}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Organizer</h2>
                <div className="flex items-center justify-start gap-2">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {event.organizerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{event.organizerName}</p>
                    <p className="text-sm text-muted-foreground">
                      Event Organizer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Right */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className={`overflow-hidden py-0`}>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-3xl font-bold">
                    {event.ticketType === "Free"
                      ? "Free"
                      : `₹${event.ticketPrice}`}
                  </p>
                  {event.ticketType === "paid" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Pay at event offline
                    </p>
                  )}
                </div>
                <Separator />

                <div className="space-y-3">
                  <div className=" flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className={"w-4 h-4"} />
                      <span className="text-sm">Attendees</span>
                    </div>
                    <p className="font-semibold">{`${event.registrationCount}/${event.capacity}`}</p>
                  </div>

                  <div className=" flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className={"w-4 h-4"} />
                      <span className="text-sm">Date</span>
                    </div>
                    <p className="font-semibold text-sm">{`${format(event.startDate, "MMM d")}`}</p>
                  </div>

                  <div className=" flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className={"w-4 h-4"} />
                      <span className="text-sm">Time</span>
                    </div>
                    <p className="font-semibold text-sm">{`${format(event.startDate, "h:mm a")}`}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-4">
                  <Button className="w-full">
                    <Ticket className="w-4 h-4" />{" "}
                    <span>Register for Event</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                    Share Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
