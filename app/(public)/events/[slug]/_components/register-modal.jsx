"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Ticket } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { is } from "date-fns/locale";
import { toast } from "sonner";
const RegisterModal = ({ open, onClose, event }) => {
  const { user } = useUser();
  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || "",
  );
  const [completeRegistration, setCompleteRegistration] = useState(false);

  const { mutate: registerForEvent, isLoading } = useConvexMutation(
    api.registrations.registerForEvent,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await registerForEvent({
        eventId: event._id,
        attendeeName: name,
        attendeeEmail: email,
      });
      toast.success("Registration successful!");
      setCompleteRegistration(true);
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Please try again.");
    }
  };

  if (completeRegistration) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md ">
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">You&apos;re All Set!</h2>
              <p className="text-muted-foreground">
                Your registration is confirmed. Check your Tickets for event
                details and your QR code ticket.
              </p>
            </div>
            <Separator />

            <Button className="w-full" asChild>
              <Link href={"/my-tickets"}>
                <Ticket className="w-4 h-4" /> View My Ticket
              </Link>
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for Event</DialogTitle>
          <DialogDescription>
            Fill in your details to register for {event.title}
          </DialogDescription>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-semibold text-white">{event.title}</p>
              <p className="text-sm text-muted-foreground ">
                {event.ticketType === "free" ? (
                  "Free Event"
                ) : (
                  <span>
                    Price: ₹{event.ticketPrice}
                    <span className="text-xs"> (Pay at venue)</span>
                  </span>
                )}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className={"text-white"}>
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className={"text-white"}>
                Email
              </Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              By registering, you agree to receive event updates and reminders
              via email.
            </p>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Registering..."
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    Register
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
