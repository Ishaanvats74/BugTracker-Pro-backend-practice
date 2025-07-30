"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 gap-4 h-16 bg-black border-b border-green-800 z-50">
      <div>
        <Link href={"/"} className="text-green-400 hover:underline">
          Bug Tacker
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <Link href={"/mybug"} className="text-green-400 hover:underline">
          Bugs You added
        </Link>
        <Link href="/bug" className="text-green-400 hover:underline">
          Add a bug
        </Link>

        <SignedOut>
          <SignInButton ><button className="text-green-400 hover:underline cursor-pointer">Sign in</button></SignInButton>
          <SignUpButton>
            <button className="bg-green-700 hover:bg-green-600 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer transition">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
