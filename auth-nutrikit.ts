import NextAuth from "next-auth"
import Apple from "next-auth/providers/apple"

// Allowed Apple User IDs - only these users can access the terminal
// Add your Apple User ID here (you can find it in Supabase users table as apple_user_id)
const ALLOWED_APPLE_USER_IDS = process.env.ALLOWED_APPLE_USER_IDS?.split(',') || [];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Apple({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // On initial sign in, store the Apple user ID
      if (account && profile) {
        token.appleUserId = profile.sub;
        token.isAllowed = ALLOWED_APPLE_USER_IDS.includes(profile.sub as string);
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the allowed status to the session
      session.user.appleUserId = token.appleUserId as string;
      session.user.isAllowed = token.isAllowed as boolean;
      return session;
    },
  },
  pages: {
    // Custom sign in page could be added here if needed
    // signIn: '/auth/signin',
  },
  // Use JWT strategy for sessions (works well with serverless)
  session: {
    strategy: "jwt",
  },
})

// Type augmentation for the session
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      appleUserId?: string;
      isAllowed?: boolean;
    }
  }
}
