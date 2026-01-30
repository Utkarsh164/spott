"use client";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const ATTENDEE_PAGES = ["/explore", "/events", "/my-tickets"];
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { data: currentUser, isLoading } = useConvex(api.users.getCurrentUser);
  useState(() => {
    if (isLoading || !currentUser) return;

    if (!currentUser.hasCompletedOnBoarding) {
      const requiresOnboaring = ATTENDEE_PAGES.some((page) =>
        pathname.startsWith(page),
      );
      if (requiresOnboaring) {
        setShowOnboarding(true);
      }
    }
  }, [isLoading, currentUser, pathname]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    router.refresh();
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    router.push("/");
  };

  return {
    showOnboarding,
    handleOnboardingComplete,
    handleOnboardingSkip,
    setShowOnboarding,
    needsOnboarding: currentUser && !currentUser.hasCompletedOnBoarding,
  };
}
