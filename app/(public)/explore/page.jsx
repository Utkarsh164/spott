"use client"
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

const ExplorePage = () => {
  const data = useQuery(api.events.getFeaturedEvents);
  console.log(data)
  return <div>Explore Page</div>;
};

export default ExplorePage;
