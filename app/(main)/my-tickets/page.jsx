"use client";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const MyTicketPage = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const router = useRouter();
  const { data: registration, isLoading } = useConvexQuery(
    api.registrations.getMyRegistrations,
  );
  const { mutate: cancelRegistration, isLoading: isCancelling } =
    useConvexMutation(api.registrations.cancelRegistration);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }
  const date = Date.now();
  return <div>MyTicketPage</div>;
};

export default MyTicketPage;
