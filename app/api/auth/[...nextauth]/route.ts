import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any) {
                if(!credentials.username || !credentials.password) {
                    return null;
                }

                if (credentials.username === "test@test.com" && credentials.password === "password") {
                    return { id: '1', name: "Test User", email: "test@test.com"};
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: "/login"
    }
});

export { handler as GET, handler as POST };