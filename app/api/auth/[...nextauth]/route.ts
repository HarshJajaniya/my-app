import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login", // your custom login page
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always send users to /chat after login
      return `${baseUrl}`;
    },
  },
});

export { handler as GET, handler as POST };
