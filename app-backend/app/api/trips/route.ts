import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const user = verifyToken(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { from, to, dateStart, dateEnd, role } = body;

    const userId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string;

    const trip = await prisma.trip.create({
      data: {
        userId,
        from,
        to,
        dateStart: new Date(dateStart),
        dateEnd: new Date(dateEnd),
        role,
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar viagem:', error); // 👈 Agora sim!
    return NextResponse.json({ error: 'Error creating trip' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error('Erro ao criar viagem:', error); // 👈 Adiciona log no console
    return NextResponse.json({ error: 'Error creating trip' }, { status: 500 });
  }
  
}
