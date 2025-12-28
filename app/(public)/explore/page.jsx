"use client";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import React from "react";

const ExplorePage = () => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const { data: featuredEvents, isLoading: loadingFeatured } = useConvexQuery(
    api.explore.getFeaturedEvents,
    { limit: 3 }
  );

  const { data: localEvents, isLoading: loadinglocal } = useConvexQuery(
    api.explore.getEventsByLocations,
    {
      city: currentUser?.location?.city || "Gurugram",
      state: currentUser?.location.state || "Haryana",
      limit: 4,
    }
  );

  const { data: popularEvents, isLoading: loadingPopular } = useConvexQuery(
    api.explore.getPopularEvents,
    { limit: 6 }
  );
  console.log(data);
  return (
    <>
      <div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover Events</h1>
      </div>
    </>
  );
};

export default ExplorePage;
