import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    brandColor: "#1ED2AF",
    logo: "/logo.png",
    buttonText: "#ffffff",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login', // Optional: Customize the sign-in page
  },
  callbacks: {
    async authorized({ auth }) {
      return !!auth;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async signIn({ user }) {
      // Add user to the database using Prisma
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!, // Ensure email is defined
              username: user.name || user.email!.split("@")[0], // Use name or fallback to email prefix
              password: null, // No password for OAuth users
            },
          });
          console.log(`User created: ${user.email}`);
        } else {
          console.log(`User already exists: ${user.email}`);
        }
        return true; // Allow sign-in
      } catch (error) {
        console.error("Error inserting user into database:", error);
        return false; // Block sign-in if there's an error
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
