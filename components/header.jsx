"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <>
      <nav className="fixed top-0 right-0 left-0 bg-background/80 backdrop-blur-xl z-20 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href={"/"} className="flex items-center justify-center">
            <Image
              src="/spott.png"
              alt="Spott logo"
              height={500}
              width={500}
              className="w-full h-11"
              priority
            />
            {/* pro tag */}
          </Link>
          {/* Search & Location */}
          {/* Right side actions */}
          <div className="flex items-center">
            <SignedOut>
              <SignedIn />
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        {/* Mobile Search location */}
      </nav>
      {/* Modals */}
    </>
  );
};

export default Header;
