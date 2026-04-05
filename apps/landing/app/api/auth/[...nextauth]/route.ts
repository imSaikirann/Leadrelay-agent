import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { isSuperAdminEmail } from "@/lib/access";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const normalizedEmail = credentials.email.trim().toLowerCase();

        const member = await prisma.teamMember.findFirst({
          where: { email: normalizedEmail, status: "active" },
        });

        if (!member) return null;

        const valid = await bcrypt.compare(credentials.password, member.password);
        if (!valid) return null;

        // Return shape NextAuth expects
        return {
          id:        member.id,
          email:     member.email,
          name:      member.name,
          role:      member.role,
          companyId: member.companyId,
          isMember:  true,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const resolvedEmail = (user.email ?? token.email) as string | undefined;
        const elevatedRole = isSuperAdminEmail(resolvedEmail) ? "superadmin" : (user as any).role;
        token.id        = user.id;
        token.email     = user.email;
        token.name      = user.name;
        token.picture   = (user as any).image ?? null;
        token.role      = elevatedRole ?? "owner";
        token.companyId = (user as any).companyId ?? null;
        token.isMember  = (user as any).isMember  ?? false;
      }

      if (!user && isSuperAdminEmail(token.email as string | undefined)) {
        token.role = "superadmin";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id        = token.id        as string;
        session.user.email     = token.email     as string;
        session.user.name      = token.name      as string;
        session.user.image     = token.picture   as string;
        session.user.role      = token.role      as string;
        session.user.companyId = token.companyId as string | null;
        session.user.isMember  = token.isMember  as boolean;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {

      return url.startsWith(baseUrl) ? url : baseUrl + "/auth-redirect";
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
