"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter(); // Initialize the router

  // While loading, don't display the header content
  if (status === "loading") {
    return null;
  }

  // If unauthenticated, redirect to sign in
  if (status === "unauthenticated") {
    signIn(); // Redirects to sign-in page
    return null;
  }

  // Extract username from session data
  const username = session?.user?.name || "Guest";

  // Calculate initials from username
  const initials = `${username.split(' ')[0][0].toUpperCase()}${
    username.split(' ')[1] ? username.split(' ')[1][0].toUpperCase() : ''
  }`;

  return (
    <header className="flex items-center justify-between">
      {/* Home Button - Navigate to Home Page */}
      <div onClick={() => router.push("/")} className="cursor-pointer">
        <img src="/images/vb_logo.png" alt="Logo" className="w-20 h-20" />
      </div>

      {/* Profile Section */}
      <div className="flex items-center space-x-4">
        {/* User Profile Button - Navigate to User Profile Page */}
        <div
          className="w-10 h-10 bg-mint text-forest_green font-bold font-playfair rounded-full flex items-center justify-center border-2 border-forest_green shadow-md"
          onClick={() => router.push("/userprofile")} // Navigate to user profile page
        >
          {initials}
        </div>
        <button
          className="bg-mint text-forest_green px-4 py-2 font-bold font-playfair rounded-full shadow-md border-2 border-forest_green"
          onClick={() => signOut()} // Use NextAuth's signOut function to log out the user
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
