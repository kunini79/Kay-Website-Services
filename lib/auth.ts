import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

/**
 * Returns the JWT signing secret. Throws if the environment variable is not set,
 * ensuring the app never falls back to a hard-coded default.
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is required. The server cannot operate without it.'
    );
  }
  return secret;
}

export interface DecodedToken {
  userId: string;
  email: string;
  name: string;
  role?: 'user' | 'teacher' | 'admin';
  schoolId?: string;
  iat: number;
  exp: number;
}

export async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as DecodedToken;
    return decoded;
  } catch {
    return null;
  }
}

export async function getTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('thinkbox_token')?.value;
    return token || null;
  } catch {
    return null;
  }
}

export async function verifyAuth(): Promise<DecodedToken | null> {
  const token = await getTokenFromCookies();
  if (!token) return null;
  return verifyToken(token);
}

export function createToken(
  userId: string,
  email: string,
  name: string,
  role: 'user' | 'teacher' = 'user',
  schoolId?: string
): string {
  return jwt.sign(
    { userId, email, name, role, ...(schoolId ? { schoolId } : {}) },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
}

// ── Admin session helpers ──────────────────────────────────────────────

export function createAdminToken(): string {
  return jwt.sign({ role: 'admin' }, getJwtSecret(), { expiresIn: '4h' });
}

/**
 * Verify the signed admin session cookie.
 * Returns true only when the cookie carries a valid JWT with role === 'admin'.
 */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;
    const decoded = jwt.verify(token, getJwtSecret()) as DecodedToken;
    return decoded.role === 'admin';
  } catch {
    return false;
  }
}
