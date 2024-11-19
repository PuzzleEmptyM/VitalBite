import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET, // Ensure this environment variable is set
  theme: {
    brandColor: "#1ED2AF",
    logo: "/logo.png",
    buttonText: "#ffffff",
  },
  providers: [], // Add providers here
  callbacks: {
    authorized: async ({ request, auth }) => {
      const path = request.nextUrl.pathname; // Correctly access request object

      // Allow public access to all API routes
      if (path.startsWith("/api/")) {
        return true;
      }

      // Require authentication for other routes
      return !!auth; // True if the user is authenticated
    },
  },
});
