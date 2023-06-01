import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/env.mjs";
import { type DefaultUser } from "next-auth";
import { type Role } from "@prisma/client";
import { prisma } from "./db";
import { compare } from "bcrypt";
import { HOURS_TO_BLOCK, LOGIN_ATTEMPTS_TO_BLOCK } from "@/constants";
import { addHours } from "date-fns";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
interface IUser extends DefaultUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

declare module "next-auth" {
  interface User extends IUser {
    account?: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {
    account?: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt ({ token, user }) {

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.isActive = user.isActive;
      }

      return token;
    },
    session ({ session, token }) {

      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.isActive = token.isActive;
      }

      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: Record<"email" | "password", string> | undefined, _req) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          throw new Error("email and password is required in credentials");
        }

        const currentUser = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!currentUser) {
          throw new Error("Wrong email or password");
        } else if (currentUser.blockExpires && new Date(currentUser.blockExpires) > new Date()) {
          throw new Error("Account is still in block");
        } else if (!currentUser.isActive) {
          throw new Error("Account is no longer active");
        } else if (currentUser.deletedAt) {
          throw new Error("Account is deleted");
        }

        const isValid = await compare(password, currentUser.password);

        if (!isValid) {
          const countInvalidLogin = await prisma.user.update({
            where: {
              id: currentUser.id,
            },
            data: {
              loginAttempts: { increment: 1 },
            }
          });

          if (
            countInvalidLogin &&
            countInvalidLogin.loginAttempts > LOGIN_ATTEMPTS_TO_BLOCK
          ) {
            await prisma.user.update({
              where: {
                id: currentUser.id,
              },
              data: {
                blockExpires: addHours(new Date(), HOURS_TO_BLOCK)
              }
            });
            throw new Error(`Too many failed login attempts. Your account has been blocked for ${HOURS_TO_BLOCK} hours.`);
          }

          throw new Error("Wrong email or password");
        }

        await prisma.user.update({
          where: {
            id: currentUser.id,
          },
          data: {
            loginAttempts: 0,
          }
        });

        return {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          isActive: currentUser.isActive,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
    secret: env.NEXTAUTH_SECRET,
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
