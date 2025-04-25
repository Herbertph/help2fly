import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, MatchStatus } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { matchId, newStatus } = body;

  if (!matchId || !newStatus) {
    return NextResponse.json({ error: 'matchId and newStatus are required' }, { status: 400 });
  }

  if (!['CONFIRMED', 'REJECTED', 'CANCELED'].includes(newStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const match = await prisma.match.update({
      where: { id: matchId },
      data: { status: newStatus as MatchStatus },
    });

    return NextResponse.json(match);
  } catch (error) {
    console.error('❌ Erro ao atualizar status do match:', error);
    return NextResponse.json({ error: 'Error updating match status' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    const user = verifyToken(req);
  
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const matches = await prisma.match.findMany({
        include: {
          fromTrip: true,
          toTrip: true,
        },
        orderBy: { confirmedAt: 'desc' },
      });
  
      return NextResponse.json(matches);
    } catch (error) {
      console.error('❌ Erro ao buscar matches:', error);
      return NextResponse.json({ error: 'Error fetching matches' }, { status: 500 });
    }
  }
