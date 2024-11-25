"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";

const Header: React.FC = () => {
  const { data: session, status } = useSession();

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
    <header className="flex items-center justify-between mb-6">
      <div onClick={() => alert("Home!")} className="cursor-pointer">
        <img src="/images/vb_logo.png" alt="Logo" className="w-20 h-20" />
      </div>

      {/* Profile Section */}
      <div className="flex items-center space-x-4">
        <div
          className="w-10 h-10 bg-mint text-forest_green font-bold font-playfair rounded-full flex items-center justify-center border-2 border-forest_green shadow-md"
          onClick={() => alert("User profile!")}
        >
          {initials}
        </div>
        <button
          className="bg-mint text-forest_green px-4 py-2 font-bold font-playfair rounded-full shadow-md border-2 border-forest_green"
          onClick={() => alert("Logout!")}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
