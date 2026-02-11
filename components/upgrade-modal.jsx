import React from "react";
import { Button } from "@/components/ui/button";
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
import { Sparkle } from "lucide-react";
import { PricingTable } from "@clerk/nextjs";

const UpgradeModal = ({ isOpen, onClose, trigger = "limit" }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkle className="w-6 h-6 text-purple-500" />
              <DialogTitle className={"text-2xl"}>Upgrade to Pro</DialogTitle>
            </div>
            <DialogDescription>
              {trigger === "header" && "Create Unlimited Events with Pro! "}
              {trigger === "limit" && "You've reached you free event limit. "}
              {trigger === "color" && "Custom theme colors are a Pro feature. "}
              Unlock unlimited events and premium featurs!
            </DialogDescription>
            <PricingTable
              checkoutProps={{
                appearance: {
                  elements: {
                    drawerRoot: {
                      zIndex: 2000,
                    },
                  },
                },
              }}
            />
            <div className="flex gap-3">
              <Button varient="outline" onClick={onClose} className={"flex-1"}>
                Maybe Later
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
