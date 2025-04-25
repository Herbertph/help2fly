import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, MatchStatus } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// POST => Criar um novo match
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
    console.error('❌ Erro ao criar match:', error);
    return NextResponse.json({ error: 'Error creating match' }, { status: 500 });
  }
}

// GET => Listar todos os matches
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
      orderBy: {
        confirmedAt: 'desc',
      },
    });

    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    console.error('❌ Erro ao buscar matches:', error);
    return NextResponse.json({ error: 'Error fetching matches' }, { status: 500 });
  }
}

// PATCH => Atualizar status de um match
export async function PATCH(req: NextRequest) {
  const user = verifyToken(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { matchId, newStatus } = await req.json();

    if (!matchId || !newStatus) {
      return NextResponse.json({ error: 'matchId and newStatus are required' }, { status: 400 });
    }

    if (!['CONFIRMED', 'REJECTED', 'CANCELED'].includes(newStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: { status: newStatus as MatchStatus },
    });

    return NextResponse.json(updatedMatch, { status: 200 });
  } catch (error) {
    console.error('❌ Erro ao atualizar status do match:', error);
    return NextResponse.json({ error: 'Error updating match status' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const username = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string;
  const url = new URL(req.url);
  const matchId = url.searchParams.get('id');

  if (!matchId) {
    return NextResponse.json({ error: 'Match ID is required' }, { status: 400 });
  }

  try {
    // Primeiro, pega o match com os dados de viagem associados
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        fromTrip: true,
        toTrip: true,
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Verifica se o usuário tem relação com o match
    if (match.fromTrip?.userId !== username && match.toTrip?.userId !== username) {
      return NextResponse.json({ error: 'Unauthorized to delete this match' }, { status: 403 });
    }

    // Deleta o match
    await prisma.match.delete({
      where: { id: matchId },
    });

    return NextResponse.json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error('❌ Erro ao deletar match:', error);
    return NextResponse.json({ error: 'Error deleting match' }, { status: 500 });
  }
}