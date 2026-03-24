// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id:        string;
      email:     string;
      name:      string;
      image:     string;
      role:      string;       // "Sales Rep" | "Sales Lead" | "owner"
      companyId: string | null;
      isMember:  boolean;      // true = TeamMember, false = owner via Google
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id:        string;
    role:      string;
    companyId: string | null;
    isMember:  boolean;
  }
}