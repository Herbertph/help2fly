import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const user = verifyToken(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { fromTripId, toTripId } = await req.json();

    const match = await prisma.match.create({
      data: {
        fromTripId,
        toTripId,
      },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar match:', error);
    return NextResponse.json({ error: 'Error creating match' }, { status: 500 });
  }
}
