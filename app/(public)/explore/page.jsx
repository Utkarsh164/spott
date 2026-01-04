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
import React, { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ExplorePage = () => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const router = useRouter();
  const { data: featuredEvents, isLoading: loadingFeatured } = useConvexQuery(
    api.explore.getFeaturedEvents,
    { limit: 3 }
  );

  const { data: localEvents, isLoading: loadinglocal } = useConvexQuery(
    api.explore.getEventsByLocations,
    {
      city: currentUser?.location?.city || "Gurugram",
      state: currentUser?.location?.state || "Haryana",
      limit: 4,
    }
  );

  const { data: popularEvents, isLoading: loadingPopular } = useConvexQuery(
    api.explore.getPopularEvents,
    { limit: 6 }
  );

  const handleEventClick = (slug) => {
    router.push(`/events/${slug}`);
  };
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
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {featuredEvents.map((events) => (
                <CarouselItem key={events._id}>
                  <div
                    onClick={()=>{handleEventClick(slug)}}
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
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </>
  );
};

export default ExplorePage;
