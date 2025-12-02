import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any) {
        if (!credentials.username || !credentials.password) {
          return null;
        }

        if (
          credentials.username === "test@test.com" &&
          credentials.password === "password"
        ) {
          return { id: "1", name: "Test User", email: "test@test.com" };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
