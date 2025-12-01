// Simple logger utility for better error tracking in production

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

function formatLogEntry(entry: LogEntry): string {
  const { timestamp, level, message, data } = entry;
  const dataStr = data ? ` | ${JSON.stringify(data)}` : "";
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${dataStr}`;
}

function createLogEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
  };
}

export const logger = {
  info: (message: string, data?: unknown) => {
    const entry = createLogEntry("info", message, data);
    console.log(formatLogEntry(entry));
  },

  warn: (message: string, data?: unknown) => {
    const entry = createLogEntry("warn", message, data);
    console.warn(formatLogEntry(entry));
  },

  error: (message: string, error?: unknown) => {
    const entry = createLogEntry("error", message, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
      } : error,
    });
    console.error(formatLogEntry(entry));
  },

  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      const entry = createLogEntry("debug", message, data);
      console.debug(formatLogEntry(entry));
    }
  },
};

