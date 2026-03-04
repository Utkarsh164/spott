"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  MapPin,
  QrCode,
  TrendingUp,
  User,
} from "lucide-react";
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
  const { event, stats } = dashboardData;
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
        {event.coverImage && (
          <div className="relative h-[250px] md:h-[400px] rounded-2xl overflow-hidden mb-6">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="flex flex-col gap-5 sm:flex-row items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Badge variant={"outline"}>
                {getCategoryIcon(event.category)}
                {getCategoryLabel(event.category)}
              </Badge>

              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(event.startDate, "PPP")}</span>
              </div>

              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{`${event.city}, ${event.state || event.country}`}</span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/events/${event.slug}`)}
              className="gap-2 flex-1"
            >
              <Eye className="w-4 h-4" />
              View
            </Button>
          </div>
        </div>

        {stats.isEventToday && !stats.isEventPast && (
          <Button
            size="lg"
            className="mb-8 w-full gap-2 h-10 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white hover:scale-[1.02]"
            onClick={() => setShowQRScanner(true)}
          >
            <QrCode className="w-6 h-6" />
            Scan QR Code to Check-In
          </Button>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card className={"py-0"}>
            <CardContent className={"p-6 flex items-center gap-3"}>
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.totalRegistrations}/{stats.capacity}
                </p>
                <p className="text-sm text-muted-foreground">Capacity</p>
              </div>
            </CardContent>
          </Card>

          <Card className={"py-0"}>
            <CardContent className={"p-6 flex items-center gap-3"}>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.checkedInCount}</p>
                <p className="text-sm text-muted-foreground">Checked In</p>
              </div>
            </CardContent>
          </Card>

          {event.ticketType === "paid" ? (
            <Card className={"py-0"}>
              <CardContent className={"p-6 flex items-center gap-3"}>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className={"py-0"}>
              <CardContent className={"p-6 flex items-center gap-3"}>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.checkInRate}%</p>
                  <p className="text-sm text-muted-foreground">Check-in Rate</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className={"py-0"}>
            <CardContent className={"p-6 flex items-center gap-3"}>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.isEventPast
                    ? "Ended"
                    : stats.hoursUntilEvent > 24
                      ? `${Math.floor(stats.hoursUntilEvent / 24)}d`
                      : `${stats.hoursUntilEvent}h`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {stats.isEventPast ? "Event Over" : "Time Left"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
