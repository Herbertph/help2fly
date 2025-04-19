import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const user = verifyToken(req)

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const username = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string
  console.log('🔑 Username extraído do token:', username)

  try {
    const userTrips = await prisma.trip.findMany({
      where: { userId: username }
    })
    console.log('📦 Viagens do usuário:', userTrips)

    const matches = []

    for (const trip of userTrips) {
      console.log('🚗 Verificando viagem:', trip)

      const potentialMatches = await prisma.trip.findMany({
        where: {
          to: trip.to,
          userId: { not: trip.userId },
          role: trip.role.toUpperCase() === 'ACTIVE' ? 'PASSIVE' : 'ACTIVE',
          dateStart: { lte: trip.dateEnd },
          dateEnd: { gte: trip.dateStart }
        }
      })

      console.log('🎯 Matches potenciais encontrados:', potentialMatches)

      for (const match of potentialMatches) {
        matches.push({
          yourTrip: trip,
          matchedTrip: match
        })
      }
    }

    console.log('✅ Matches finais:', matches)

    return NextResponse.json(matches)
  } catch (error) {
    console.error('❌ Erro no matchmaking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
