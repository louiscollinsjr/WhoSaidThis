import { quotes, type Quote } from '$lib/quotes';
import { romaniaDateKey } from '$lib/time';

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function todaysQuote(date = new Date()): Quote {
  const key = romaniaDateKey(date);
  const idx = hash(key) % quotes.length;
  return quotes[idx];
}
