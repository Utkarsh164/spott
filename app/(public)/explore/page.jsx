"use client";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React, { useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Loader2, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/event-card";
import { CATEGORIES } from "@/lib/data";

const ExplorePage = () => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const router = useRouter();
  const { data: featuredEvents, isLoading: loadingFeatured } = useConvexQuery(
    api.explore.getFeaturedEvents,
    { limit: 5 },
  );

  const { data: localEvents, isLoading: loadinglocal } = useConvexQuery(
    api.explore.getEventsByLocations,
    {
      city: currentUser?.location?.city || "Gurugram",
      state: currentUser?.location?.state || "Haryana",
      limit: 4,
    },
  );

  const { data: popularEvents, isLoading: loadingPopular } = useConvexQuery(
    api.explore.getPopularEvents,
    { limit: 6 },
  );

  const { data: categoryCounts } = useConvexQuery(api.explore.getCategoryCount);

  const categoriesWithCounts = CATEGORIES.map((cat) => {
    return { ...cat, count: categoryCounts?.[cat.id] || 0 };
  });

  const handleEventClick = (slug) => {
    router.push(`/events/${slug}`);
  };

  const handleCategoryClick = (categoryId) => {
    router.push(`/events/${categoryId}`);
  };

  const handleViewLocalEvents = () => {
    const city = currentUser?.location?.city || "Gurugram";
    const state = currentUser?.location?.state || "Haryana";
    const slug = createLocationSlug(city, state);
    router.push(`/explore/${slug}`);
  };
  const isLoading = loadingFeatured || loadingPopular || loadinglocal;
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }
  return (
    <>
      <div className="pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover Events</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore featured events, find what&apos;s happening locally, or browse
          events across India
        </p>
      </div>

      {featuredEvents && featuredEvents.length > 0 && (
        <div className="mb-16">
          <Carousel
            className="w-full"
            opts={{ loop: true }}
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {featuredEvents.map((events) => (
                <CarouselItem key={events._id}>
                  <div
                    onClick={() => {
                      handleEventClick(events.slug);
                    }}
                    className="relative h-[400] rounded-xl overflow-hidden cursor-pointer"
                  >
                    {events.coverImage ? (
                      <Image
                        src={events.coverImage}
                        alt={events.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: events.themeColor }}
                      ></div>
                    )}
                    <div className="absolute insert-0 bg-linear-to-r from-balck/60 to-black/30" />
                    <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                      <Badge className="w-fit mb-4" varient="secondary">
                        {events.city},{events.state || events.country}
                      </Badge>
                      <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white">
                        {events.title}
                      </h2>
                      <p className="text-lg text-white/90 mb-4 max-w-2xl line-clamp-2">
                        {events.description}
                      </p>
                      <div className="flex items-center gap-4 text-white/80">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {format(events.startDate, "PPP")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{events.city}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {events.registrationCount} registered
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      )}
      {localEvents && localEvents.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-1">Events Near You</h2>
              <p className="text-muted-foreground">
                Happening in {currentUser?.location?.city || "your area"}
              </p>
            </div>
            <Button
              varient="outline"
              className="gap-2"
              onClick={handleViewLocalEvents}
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {localEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                varient="grid"
                onClick={() => handleEventClick(event.slug)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {categoriesWithCounts.map((category) => {
            return (
              <Card
                key={category.id}
                className="py-2 group cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50"
                onClick={() => {
                  handleCategoryClick(category.id);
                }}
              >
                <CardContent className="px-3 sm:p-6 flex items-center gap-3">
                  <div className="text-3xl sm:text-4xl">{category.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                      {category.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} Event{category.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Popular Events */}
      {popularEvents && popularEvents.length > 0 && (
        <div className="mb-16">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-1">Popular Across India</h2>
            <p className="text-muted-foreground">Trending events nationwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                variant="list"
                onClick={() => handleEventClick(event.slug)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loadingFeatured &&
        !loadingPopular &&
        !loadinglocal &&
        (!featuredEvents || featuredEvents.length === 0) &&
        (!localEvents || localEvents.length === 0) &&
        (!popularEvents || popularEvents.length === 0) && (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold">No events yet</h2>
              <p className="text-muted-foreground">
                Be the first to create an event in your area!
              </p>
              <Button asChild className="gap-2">
                <a href="/create-event">Create Event</a>
              </Button>
            </div>
          </Card>
        )}
    </>
  );
};

export default ExplorePage;
