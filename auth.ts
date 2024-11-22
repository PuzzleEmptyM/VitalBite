import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        // Compare passwords
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Map Prisma user to NextAuth user type
        const nextAuthUser: NextAuthUser = {
          id: user.uid.toString(), // Convert uid to string, since NextAuth expects string ids
          email: user.email,
          name: user.username,
        };

        return nextAuthUser;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Optional: Customize the sign-in page
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id as string;
      }
      return session;
    },
    async signIn({ user }) {
      try {
        // Add user to the database using Prisma for Google sign-ins
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              username: user.name || user.email!.split("@")[0],
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
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
