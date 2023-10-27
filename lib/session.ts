import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '@/app/db';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await prisma.user.findUnique({
        where: {
          email: session?.user?.email as string,
        },
      });

      session.user?.id = sessionUser.id.toString();

      return session;
    },
    async signIn({ user }) {
      try {
        const userExists = await prisma.user.findUnique({
          where: {
            email: user?.email as string,
          },
        });

        if (!userExists) {
          await prisma.user.create({
            data: {
              email: user?.email,
              name: user?.name?.replace(' ', '').toLowerCase(),
              avatarUrl: user?.image,
            },
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
