import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

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
    async jwt({ token, user }) {
      console.log("JWT callback triggered");
      if (user) {
        console.log("User found, adding data to token:", user);
        token.uid = user.id;  // Ensure `uid` is treated as a string (UUID)
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  
    async session({ session, token }) {
      console.log("Session callback triggered");
      if (token?.uid) {
        console.log("Adding user ID to session:", token.uid);
        session.user.id = token.uid; // `uid` should be treated as a string (UUID)
      }
      session.user.email = token.email ?? "";
      session.user.name = token.name ?? "";
      console.log("Session data:", session);
      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log("Redirect callback triggered, base URL:", baseUrl);
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});
