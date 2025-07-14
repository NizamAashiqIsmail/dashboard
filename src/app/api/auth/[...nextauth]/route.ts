import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";
import bcrypt from "bcrypt";

// Connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure this is set in .env.local
});

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        const client = await pool.connect();

        try {
          const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
          const user = result.rows[0];

          if (!user) return null;

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id: user.id.toString(),
            name: user.email,
            email: user.email,
          };
        } catch (err) {
          console.error("Error during login:", err);
          return null;
        } finally {
          client.release();
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as typeof session.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
