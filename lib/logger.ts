/**
 * lib/logger.ts
 * Logger ringan untuk server-side.
 * - Development: output berwarna ke console
 * - Production:  output JSON terstruktur (mudah dibaca di Vercel Logs)
 *
 * Tidak ada dependency eksternal, tidak ada service berbayar.
 * Kalau nanti mau tambah Sentry/Datadog, tinggal hook di fungsi error() ini.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

type LogMeta = Record<string, unknown>;

const IS_PROD = process.env.NODE_ENV === "production";
const IS_DEV  = process.env.NODE_ENV === "development";

// Warna ANSI untuk development
const COLOR = {
  reset:  "\x1b[0m",
  dim:    "\x1b[2m",
  blue:   "\x1b[34m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  gray:   "\x1b[90m",
} as const;

function formatDev(level: LogLevel, message: string, meta?: LogMeta): string {
  const time  = new Date().toTimeString().slice(0, 8);
  const color = level === "error"  ? COLOR.red
              : level === "warn"   ? COLOR.yellow
              : level === "info"   ? COLOR.blue
              : COLOR.gray;

  const prefix = `${COLOR.dim}${time}${COLOR.reset} ${color}[${level.toUpperCase()}]${COLOR.reset}`;
  const metaStr = meta ? ` ${COLOR.dim}${JSON.stringify(meta)}${COLOR.reset}` : "";
  return `${prefix} ${message}${metaStr}`;
}

function formatProd(level: LogLevel, message: string, meta?: LogMeta): string {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    service:   "indofa-web",
    ...meta,
  });
}

function log(level: LogLevel, message: string, meta?: LogMeta): void {
  // Jangan log debug di production
  if (IS_PROD && level === "debug") return;

  const output = IS_DEV
    ? formatDev(level, message, meta)
    : formatProd(level, message, meta);

  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  debug: (message: string, meta?: LogMeta) => log("debug", message, meta),
  info:  (message: string, meta?: LogMeta) => log("info",  message, meta),
  warn:  (message: string, meta?: LogMeta) => log("warn",  message, meta),

  /**
   * Log error + stack trace.
   * Di production, ini adalah tempat untuk hook ke Sentry/Datadog jika nanti dibutuhkan.
   */
  error: (message: string, error?: unknown, meta?: LogMeta) => {
    const errMeta: LogMeta = { ...meta };

    if (error instanceof Error) {
      errMeta.errorMessage = error.message;
      errMeta.errorName    = error.name;
      if (IS_DEV) errMeta.stack = error.stack;
    } else if (error !== undefined) {
      errMeta.error = String(error);
    }

    log("error", message, errMeta);

    // TODO: Hook ke Sentry jika diperlukan
    // if (IS_PROD && typeof Sentry !== "undefined") {
    //   Sentry.captureException(error, { extra: meta });
    // }
  },
} as const;
