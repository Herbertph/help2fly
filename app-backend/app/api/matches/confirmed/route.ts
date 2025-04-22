import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const username = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string;

  try {
    // 🧠 Busca os trips desse usuário
    const userTrips = await prisma.trip.findMany({
      where: { userId: username },
      select: { id: true },
    });

    const tripIds = userTrips.map((trip: { id: string }) => trip.id);

    // 🎯 Busca os matches confirmados envolvendo os trips do usuário
    const matches = await prisma.match.findMany({
        where: {
          confirmedAt: {
            not: undefined, // 👉 considera qualquer valor definido (ou seja, confirmado)
          },
          OR: [
            { fromTripId: { in: tripIds } },
            { toTripId: { in: tripIds } },
          ],
        },
        include: {
          fromTrip: true,
          toTrip: true,
        },
      });
      

    return NextResponse.json(matches);
  } catch (error) {
    console.error('❌ Erro ao buscar matches confirmados:', error);
    return NextResponse.json({ error: 'Error fetching confirmed matches' }, { status: 500 });
  }
}
