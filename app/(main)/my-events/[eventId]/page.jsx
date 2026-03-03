"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const EventDashboard = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId;
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);

  const { data: dashboardData, isLoading } = useConvexQuery(
    api.dashboard.getEventDashboard,
    { eventId },
  );

  const { data: registrations, isLoading: loadingRegistrations } =
    useConvexQuery(api.registrations.getEventRegistrations, { eventId });

  if (isLoading || loadingRegistrations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }
  if (!dashboardData) {
    notFound();
  }
  const { event, start } = dashboardData;
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.attendeeName.toLowerCase().include(searchQuery.toLowerCase()) ||
      reg.attendeeEmail.toLowerCase().include(searchQuery.toLowerCase()) ||
      reg.qrCode.toLowerCase().include(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch && reg.status === "confirmed";
    if (activeTab === "checked-in")
      return matchesSearch && reg.checkedIn && reg.status === "confirmed";
    if (activeTab === "pending")
      return matchesSearch && reg.checkedIn && reg.status === "confirmed";

    return matchesSearch;
  });
  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/my-events")}
          className="gap-2 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Events
        </Button>
      </div>
      {event.coverImage && (
        <div className="relative h-[350px] rounded-2xl overflow-hidden mb-6">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="objecy-cover"
            priority
          />
        </div>
      )}
    </div>
  );
};

export default EventDashboard;
