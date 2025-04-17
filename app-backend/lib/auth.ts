import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SECRET = 'minha_chave_supersecreta_123456789'; // MESMA do auth-service

export function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET) as Record<string, unknown>;
    return decoded;
  } catch {
    return null;
  }
}
