import type { RequestHandler } from '@sveltejs/kit';
import { todaysQuote } from '$lib/rotation';
import { romaniaDateKey, ROMANIA_TZ } from '$lib/time';

export const GET: RequestHandler = async () => {
  const quote = todaysQuote();
  const questionType = Math.random() > 0.5 ? 'speaker' : 'recipient';
  const dateKey = romaniaDateKey();

  return new Response(
    JSON.stringify({
      quote,
      questionType,
      dateKey,
      timeZone: ROMANIA_TZ
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
