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
    console.error('Erro ao criar viagem:', error);
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
    console.error('Erro ao buscar viagens:', error);
    return NextResponse.json({ error: 'Error fetching trips' }, { status: 500 });
  }
}

// ❗ O DELETE estava fora do escopo do arquivo
export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const username = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string;
  const url = new URL(req.url);
  const tripId = url.searchParams.get('id');

  if (!tripId) {
    return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
  }

  try {
    console.log('🧨 DELETE trip chamado');
    console.log(`🧨 Deletando trip ${tripId} do usuário ${username}`);

    // Verifica se a trip pertence ao usuário
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });

    if (!trip || trip.userId !== username) {
      return NextResponse.json({ error: 'Trip not found or unauthorized' }, { status: 404 });
    }

    // Remove todos os matches relacionados a essa trip (como origem ou destino)
    await prisma.match.deleteMany({
      where: {
        OR: [
          { fromTripId: tripId },
          { toTripId: tripId }
        ]
      }
    });

    // Agora sim, deleta a viagem
    await prisma.trip.delete({ where: { id: tripId } });

    return NextResponse.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('❌ Erro ao deletar viagem:', error);
    return NextResponse.json({ error: 'Error deleting trip' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  console.log('✏️ PATCH trip chamado!');

  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const username = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string;
  const body = await req.json();
  const { id, from, to, dateStart, dateEnd, role } = body;

  console.log('📦 Dados recebidos para update:', body);

  if (!id) {
    return NextResponse.json({ error: 'Trip ID is required for update' }, { status: 400 });
  }

  try {
    const trip = await prisma.trip.findUnique({ where: { id } });

    if (!trip || trip.userId !== username) {
      return NextResponse.json({ error: 'Trip not found or unauthorized' }, { status: 404 });
    }

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        from,
        to,
        dateStart: new Date(dateStart),
        dateEnd: new Date(dateEnd),
        role,
      },
    });

    console.log('✅ Trip atualizada:', updatedTrip);

    return NextResponse.json(updatedTrip, { status: 200 });
  } catch (error) {
    console.error('❌ Erro ao atualizar viagem:', error);
    return NextResponse.json({ error: 'Error updating trip' }, { status: 500 });
  }
}
