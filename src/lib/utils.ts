import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeJSONParse<T>(jsonStr?: string, defaultValue?: T) {
  if (typeof jsonStr !== 'string') {
    return jsonStr ?? defaultValue;
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return defaultValue;
  }
}
