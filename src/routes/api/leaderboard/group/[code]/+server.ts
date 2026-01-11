import type { RequestHandler } from '@sveltejs/kit';
import { getScoresForDate } from '$lib/store';
import { romaniaDateKey } from '$lib/time';

export const GET: RequestHandler = async ({ params }) => {
  // Route params guarantee presence; slice to 12 chars for safety.
  const groupCode = params.code.slice(0, 12);

  const dateKey = romaniaDateKey();
  const scores = await getScoresForDate(dateKey, groupCode);
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

  return new Response(JSON.stringify({ dateKey, groupCode, items: sorted }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
