import { getServerSession } from 'next-auth/next';
import { NextAuthOptions, Session, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { AdapterUser } from 'next-auth/adapters';

import prisma from '@/app/db';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  description: string | null;
  githubUrl: string | null;
  linkedInUrl: string | null;
}

interface SessionInterface extends Session {
  user: User & {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session }) {
      const email = session?.user?.email as string;

      try {
        const data = (await prisma.user.findUnique({
          where: {
            email: session?.user?.email as string,
          },
        })) as { user?: UserProfile };

        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data?.user,
          },
        };

        return newSession;
      } catch (error: any) {
        console.error('Error retrieving user data: ', error.message);
        return session;
      }
    },
    async signIn({ user }: { user: AdapterUser | User }) {
      try {
        const userExists = await prisma.user.findUnique({
          where: {
            email: user?.email as string,
          },
        });

        if (!userExists) {
          await prisma.user.create({
            data: {
              email: user?.email as string,
              name: user?.name?.replace(' ', '').toLowerCase() as string,
              avatarUrl: user?.image as string,
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
};

export async function getCurrentUser() {
  const session = (await getServerSession(authOptions)) as SessionInterface;

  return session;
}
