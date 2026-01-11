import type { Quote } from '$lib/quotes';
import { normalizeAnswer, levenshtein } from '$lib/normalize';

export type QuestionType = 'speaker' | 'recipient';

export function validateAnswer(
  quote: Quote,
  questionType: QuestionType,
  userInput: string
): { isCorrect: boolean; normalizedUser: string; normalizedExpected: string } {
  const normalizedUser = normalizeAnswer(userInput);
  const targetRaw = questionType === 'speaker' ? quote.speaker : quote.recipient;
  const normalizedExpected = normalizeAnswer(targetRaw);
  const aliases = (quote.aliases || []).map(normalizeAnswer);

  if (!normalizedUser) return { isCorrect: false, normalizedUser, normalizedExpected };

  const matches =
    normalizedUser === normalizedExpected ||
    aliases.includes(normalizedUser) ||
    levenshtein(normalizedUser, normalizedExpected) <= 2;

  return { isCorrect: matches, normalizedUser, normalizedExpected };
}

export function scorePoints(isCorrect: boolean, timeSeconds: number): number {
  if (!isCorrect) return 0;
  if (timeSeconds < 30) return 10;
  if (timeSeconds < 60) return 8;
  if (timeSeconds < 120) return 6;
  return 4;
}
