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
const RegisterModal = ({ open, onClose, event }) => {
  useEffect(() => {
    console.log(event);
  }, [event]);
  const [completeRegistration, setCompleteRegistration] = useState(false);

  if(completeRegistration){
    return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
          
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
