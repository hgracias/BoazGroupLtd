import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { verifyCredentials } from "@/lib/data";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // A shift plus overnight rest — drivers should not be logged out mid-trip.
    maxAge: 60 * 60 * 24,
  },
  pages: {
    signIn: "/driver/login",
    error: "/driver/login",
  },
  providers: [
    CredentialsProvider({
      name: "Employee ID",
      credentials: {
        employeeId: { label: "Employee ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.employeeId || !credentials.password) return null;

        const user = await verifyCredentials(credentials.employeeId, credentials.password);
        if (!user) return null;

        return {
          id: user.record.id,
          employeeId: user.record.employeeId,
          role: user.record.role,
          name: user.record.fullName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.employeeId = user.employeeId;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        employeeId: token.employeeId,
        role: token.role,
        name: token.name,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
