import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import prisma from '@/app/db';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session }) {
      const sessionUser = await prisma.user.findUnique({
        where: {
          email: session?.user?.email,
        },
      });

      session.user.id = sessionUser?.id.toString();

      return session;
    },
    async signIn({ profile }) {
      try {
        const userExists = await prisma.user.findUnique({
          where: {
            email: profile?.email,
          },
        });

        if (!userExists) {
          await prisma.user.create({
            data: {
              email: profile?.email,
              name: profile?.name?.replace(' ', '').toLowerCase(),
              image: profile?.picture,
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
