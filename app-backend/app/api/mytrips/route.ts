import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const user = verifyToken(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string;

  try {
    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(trips);
} catch {
    return NextResponse.json({ error: 'Error creating trip' }, { status: 500 });
  }
}
