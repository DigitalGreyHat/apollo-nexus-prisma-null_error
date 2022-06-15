import { PrismaClient, Session } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import { AuthenticationError } from 'apollo-server-micro';

export interface Context {
    prisma: PrismaClient;
    currentUserEmail: string;
    session: Session | any; //TODO "Any" necessary to avoid error ?
}

/**
 * It creates a context object that contains the Prisma client and the email of the currently
 * authenticated user
 * @param  - req - The request object from the HTTP request.
 * @returns A context object with the prisma client and the current user's email.
 */
export async function createContext({ req, res }): Promise<Context> {
    const session = await getSession({ req });

    const userEmail: string = session?.user?.email;

    // Throw if invalid
    // if (!userEmail) {
    //     throw new AuthenticationError('Authentication is required');
    // }

    return { prisma, currentUserEmail: userEmail, session };
}
