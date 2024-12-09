import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    isNewUser?: boolean;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    uid: string;
    email: string;
    name: string;
    isNewUser?: boolean;
  }
}
