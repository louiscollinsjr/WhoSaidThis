import type { RequestHandler } from '@sveltejs/kit';
import { getScoresForDate } from '$lib/store';
import { romaniaDateKey } from '$lib/time';

export const GET: RequestHandler = async () => {
  const dateKey = romaniaDateKey();
  const scores = await getScoresForDate(dateKey);
  const sorted = scores
    .slice()
    .sort(
      (a, b) =>
        b.points - a.points ||
        a.timeSeconds - b.timeSeconds ||
        a.submittedAt - b.submittedAt
    )
    .map((s, idx) => ({ ...s, rank: idx + 1 }))
    .slice(0, 20);

  return new Response(JSON.stringify({ dateKey, items: sorted }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
