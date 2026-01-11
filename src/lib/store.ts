import type { QuestionType } from '$lib/scoring';
import { env } from '$env/dynamic/private';
import { Pool } from 'pg';

export type ScoreEntry = {
  userId: string;
  displayName: string;
  quoteId: number;
  questionType: QuestionType;
  answer: string;
  timeSeconds: number;
  points: number;
  isCorrect: boolean;
  dateKey: string;
  groupCode?: string | null;
  submittedAt: number;
};

// In-memory fallback for local/no-DB scenarios.
const memoryScores: ScoreEntry[] = [];

const pool = env.DATABASE_URL
  ? new Pool({
      connectionString: env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : null;

export async function upsertScore(entry: ScoreEntry): Promise<ScoreEntry> {
  if (!pool) {
    const existingIndex = memoryScores.findIndex(
      (s) =>
        s.userId === entry.userId &&
        s.dateKey === entry.dateKey &&
        s.quoteId === entry.quoteId &&
        s.questionType === entry.questionType &&
        (s.groupCode || null) === (entry.groupCode || null)
    );
    if (existingIndex >= 0) {
      return memoryScores[existingIndex];
    }
    memoryScores.push(entry);
    return entry;
  }

  const client = await pool.connect();
  try {
    const result = await client.query<ScoreEntry>(
      `
      INSERT INTO daily_scores
      (user_id, display_name, group_code, quote_id, question_type, answer, is_correct, time_seconds, points, date_key, submitted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, to_timestamp($11/1000.0))
      ON CONFLICT ON CONSTRAINT daily_scores_once_per_day
      DO NOTHING
      RETURNING user_id as "userId", display_name as "displayName",
                quote_id as "quoteId", question_type as "questionType",
                time_seconds as "timeSeconds", points, is_correct as "isCorrect",
                date_key as "dateKey", group_code as "groupCode",
                extract(epoch from submitted_at)*1000 as "submittedAt";
    `,
      [
        entry.userId,
        entry.displayName,
        entry.groupCode || null,
        entry.quoteId,
        entry.questionType,
        entry.answer ?? entry.displayName ?? '',
        entry.isCorrect,
        entry.timeSeconds,
        entry.points,
        entry.dateKey,
        entry.submittedAt
      ]
    );

    if (result.rowCount && result.rows[0]) {
      return result.rows[0];
    }

    // If conflict, fetch existing
    const existing = await client.query<ScoreEntry>(
      `
      SELECT user_id as "userId",
             display_name as "displayName",
             quote_id as "quoteId",
             question_type as "questionType",
             time_seconds as "timeSeconds",
             points,
             is_correct as "isCorrect",
             date_key as "dateKey",
             group_code as "groupCode",
             extract(epoch from submitted_at)*1000 as "submittedAt"
      FROM daily_scores
      WHERE user_id = $1 AND date_key = $2 AND quote_id = $3 AND question_type = $4 AND (group_code = $5 OR ($5 IS NULL AND group_code IS NULL))
      LIMIT 1;
    `,
      [
        entry.userId,
        entry.dateKey,
        entry.quoteId,
        entry.questionType,
        entry.groupCode || null
      ]
    );
    if (existing.rowCount && existing.rows[0]) return existing.rows[0];
    return entry;
  } finally {
    client.release();
  }
}

export async function getScoresForDate(
  dateKey: string,
  groupCode?: string | null
): Promise<ScoreEntry[]> {
  if (!pool) {
    return memoryScores.filter(
      (s) => s.dateKey === dateKey && (groupCode ? s.groupCode === groupCode : true)
    );
  }
  const client = await pool.connect();
  try {
    const result = await client.query<ScoreEntry>(
      `
      SELECT user_id as "userId",
             display_name as "displayName",
             quote_id as "quoteId",
             question_type as "questionType",
             time_seconds as "timeSeconds",
             points,
             is_correct as "isCorrect",
             date_key as "dateKey",
             group_code as "groupCode",
             extract(epoch from submitted_at)*1000 as "submittedAt"
      FROM daily_scores
      WHERE date_key = $1
        AND ($2::text IS NULL OR group_code = $2)
    `,
      [dateKey, groupCode || null]
    );
    return result.rows;
  } finally {
    client.release();
  }
}
