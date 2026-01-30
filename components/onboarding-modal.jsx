"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { Badge } from "./ui/badge";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
const OnboardingModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const progress = (step / 2) * 100;
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [location, setLocation] = useState({
    state: "",
    city: "",
    country: "India",
  });

  const { mutate: completeOnBoarding, isLoading } = useConvexMutation(
    api.users.completeOnBoarding,
  );

  const toggleInterest = (categoryId) => {
    // setSelectedInterests(
    //   selectedInterests.includes(categoryId)
    //     ? selectedInterests.filter((id) => id !== categoryId)
    //     : [...selectedInterests, categoryId],
    // );

    //Above vertion and below version works the same but
    // That value can become stale if React batches updates or if this runs multiple times quickly.

    //The prev version always uses the latest state, guaranteed.

    setSelectedInterests((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleComplete = async () => {};
  const handleNext = () => {
    if (step === 1 && selectedInterests.length < 3) {
      toast.error("Please select at least 3 interests");
      return;
    }
    if (step === 2 && (!location.city || !location.state)) {
      toast.error("Please select both state and city");
      return;
    }
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-4">
            <Progress value={progress} className="h-1" />
          </div>
          <DialogTitle className={"flex items-center gap-2 text-2xl"}>
            {step === 1 ? (
              <>
                <Heart className="w-6 h-6 text-purple-500" />
                What interests you?
              </>
            ) : (
              <>
                <MapPin className="w-6 h-6 text-purple-500" />
                Where are you located?
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Select at least 3 categories to personalize your experience"
              : "We'll show you events happening near you"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleInterest(category.id)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedInterests.includes(category.id)
                        ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                        : "border-border hover:border-purple-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                ))}
              </div>
              <div className="min-h-[22px] flex items-center">
                {selectedInterests.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge>{selectedInterests.length} selected</Badge>
                    {selectedInterests.length > 3 && (
                      <div className="text-sm text-green-500">
                        ✓ Ready to continue
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className={"flex gap-3 p-0"}>
          <Button
            className="flex-1 gap-2"
            disabled={isLoading}
            onClick={handleNext}
          >
            {isLoading
              ? "Completing ..."
              : step === 2
                ? "complete Setup"
                : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
