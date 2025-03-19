import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          throw new Error("Email and Password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
});
