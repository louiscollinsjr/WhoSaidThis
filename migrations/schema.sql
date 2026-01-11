CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE groups (
  code CHAR(6) PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE daily_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  display_name TEXT NOT NULL,
  group_code CHAR(6) REFERENCES groups(code),
  quote_id INTEGER NOT NULL,
  question_type TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_seconds INTEGER NOT NULL,
  points INTEGER NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  date_key TEXT NOT NULL
);
CREATE UNIQUE INDEX daily_scores_once_per_day
  ON daily_scores(user_id, quote_id, question_type, date_key, group_code);