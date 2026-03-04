/**
 * Structured Logger with Request IDs for production observability.
 *
 * Every log line is a single JSON object so log aggregators (Vercel,
 * Datadog, etc.) can parse fields automatically.
 *
 * Usage in API routes:
 *   const log = createRequestLogger('POST /api/login', request);
 *   log.info('user authenticated', { userId: '123' });
 *   log.warn('rate limited');
 *   log.error('db failed', error);
 */

import { NextRequest } from 'next/server';
import crypto from 'crypto';

// ── Error classes ──────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Not authenticated') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfter?: number;
  constructor(retryAfter?: number) {
    super('Too many requests', 'RATE_LIMIT', 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string) {
    super(`${service}: ${message}`, 'EXTERNAL_SERVICE_ERROR', 502);
    this.name = 'ExternalServiceError';
  }
}

// ── Logger ─────────────────────────────────────────────────────────────

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  requestId: string;
  route: string;
  message: string;
  timestamp: string;
  durationMs?: number;
  [key: string]: unknown;
}

export interface RequestLogger {
  /** Unique ID for this request — also set as x-request-id response header. */
  requestId: string;
  info(message: string, extra?: Record<string, unknown>): void;
  warn(message: string, extra?: Record<string, unknown>): void;
  error(message: string, error?: unknown, extra?: Record<string, unknown>): void;
  /** Returns milliseconds since logger creation (request start). */
  elapsed(): number;
}

function emit(entry: LogEntry) {
  const { level, ...rest } = entry;
  const line = JSON.stringify(rest);
  switch (level) {
    case 'error':
      console.error(line);
      break;
    case 'warn':
      console.warn(line);
      break;
    default:
      console.log(line);
  }
}

function serializeError(err: unknown): Record<string, unknown> {
  if (err instanceof AppError) {
    return {
      errorName: err.name,
      errorCode: err.code,
      errorMessage: err.message,
      statusCode: err.statusCode,
      isOperational: err.isOperational,
      ...(err instanceof RateLimitError && err.retryAfter != null
        ? { retryAfter: err.retryAfter }
        : {}),
    };
  }
  if (err instanceof Error) {
    return {
      errorName: err.name,
      errorMessage: err.message,
      stack: err.stack?.split('\n').slice(0, 5).join(' | '),
    };
  }
  return { errorMessage: String(err) };
}

/**
 * Create a request-scoped structured logger.
 *
 * @param route  A human-friendly label like "POST /api/login"
 * @param request  Optional NextRequest to extract IP / user-agent
 */
export function createRequestLogger(
  route: string,
  request?: NextRequest
): RequestLogger {
  const requestId =
    request?.headers.get('x-request-id') || crypto.randomUUID();
  const start = Date.now();

  const base = (): Partial<LogEntry> => ({
    requestId,
    route,
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - start,
  });

  return {
    requestId,
    info(message, extra) {
      emit({ level: 'info', ...base(), message, ...extra } as LogEntry);
    },
    warn(message, extra) {
      emit({ level: 'warn', ...base(), message, ...extra } as LogEntry);
    },
    error(message, err, extra) {
      emit({
        level: 'error',
        ...base(),
        message,
        ...serializeError(err),
        ...extra,
      } as LogEntry);
    },
    elapsed() {
      return Date.now() - start;
    },
  };
}

/**
 * Helper: attach request-id header to a NextResponse.
 */
export function withRequestId(
  response: Response,
  requestId: string
): Response {
  response.headers.set('x-request-id', requestId);
  return response;
}
