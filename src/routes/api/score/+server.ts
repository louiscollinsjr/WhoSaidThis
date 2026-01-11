import type { RequestHandler } from '@sveltejs/kit';
import { todaysQuote } from '$lib/rotation';
import { romaniaDateKey } from '$lib/time';
import { validateAnswer, scorePoints, type QuestionType } from '$lib/scoring';
import { upsertScore } from '$lib/store';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const quoteId = Number(body?.quoteId);
    const questionType = (body?.questionType as QuestionType) || 'speaker';
    const answer = String(body?.answer ?? '');
    const timeSeconds = Math.max(0, Number(body?.timeSeconds ?? 0));
    const displayName = String(body?.displayName ?? '').slice(0, 40);
    const userId = String(body?.userId ?? '') || 'anonymous';
    const groupCode = body?.groupCode ? String(body.groupCode).slice(0, 12) : null;

    if (!quoteId || (questionType !== 'speaker' && questionType !== 'recipient')) {
      return new Response(JSON.stringify({ message: 'Invalid payload' }), { status: 400 });
    }

    const today = todaysQuote();
    if (today.id !== quoteId) {
      return new Response(JSON.stringify({ message: 'Quote mismatch for today' }), { status: 400 });
    }

    const { isCorrect } = validateAnswer(today, questionType, answer);
    const points = scorePoints(isCorrect, timeSeconds);
    const dateKey = romaniaDateKey();

    const record = await upsertScore({
      userId,
      displayName: displayName || 'Player',
      quoteId,
      questionType,
      answer,
      timeSeconds,
      points,
      isCorrect,
      dateKey,
      groupCode,
      submittedAt: Date.now()
    });

    return new Response(
      JSON.stringify({
        points: record.points,
        isCorrect: record.isCorrect
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};
