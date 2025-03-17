import type { NextAuthConfig } from "next-auth";


export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
      };
      return session;
    },
    authorized: ({ auth, request: { nextUrl } }) => {
      // Define public routes
      const publicRoutes = [ "/auth/login", "/auth/register"];
      const { pathname } = nextUrl;

      // Allow access to public routes
      if (publicRoutes.includes(pathname)) {
        return true;
      }

      // Restrict access to authenticated users for other routes
      return !!auth;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
