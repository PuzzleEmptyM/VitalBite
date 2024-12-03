import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { setCookie } from 'cookies-next';

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
      authorization: {
        params: {
          scope: "openid profile email https://www.googleapis.com/auth/userinfo.profile",
          prompt: "select_account",
        },
      },
      checks: [], // remove PKCE
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Attempting to authorize with credentials:", credentials);

        if (!credentials?.email || !credentials?.password) {
          console.log("Error: Missing email or password");
          throw new Error("Missing email or password");
        }

        // Find user by email
        console.log("Searching for user with email:", credentials.email);
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          console.log("Error: No user found with this email:", credentials.email);
          throw new Error("No user found with this email");
        }

        // Compare the password with the hashed password in the database
        console.log("Comparing password for user:", credentials.email);
        const isValidPassword = await compare(credentials.password as string, user.password);
        if (!isValidPassword) {
          console.log("Error: Incorrect password for user:", credentials.email);
          throw new Error("Incorrect password");
        }

        console.log("User authenticated successfully:", user.email);
        return {
          id: user.uid, // `uid` should be treated as a string (UUID)
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // If signing in for the first time, we have `user` and `account` objects
      if (account && user) {
        // Try to find an existing user in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
  
        if (existingUser) {
          // Existing user: add UID to token and set isNewUser to false
          token.uid = existingUser.uid;
          token.isNewUser = false;
        } else {
          // New user: create them in the database and set isNewUser to true
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              username: user.name || "Unknown",
            },
          });
          token.uid = newUser.uid;
          token.isNewUser = true;
        }
      }
  
      return token;
    },
    async session({ session, token }) {
      if (token?.uid) {
        session.user.id = token.uid;
      }
      session.user.email = token.email ?? "";
      session.user.name = token.name ?? "";
      session.user.isNewUser = token.isNewUser ?? false;
  
      return session;
    },
  },
  

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});
