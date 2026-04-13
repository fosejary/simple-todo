-- SimpleTodo Initial Schema
-- Run this in your Supabase SQL Editor

-- 1. Categories
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  color       TEXT DEFAULT '#2563EB',
  icon        TEXT DEFAULT 'folder',
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);

-- 2. Todos
CREATE TABLE IF NOT EXISTS todos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  memo          TEXT DEFAULT '',
  is_completed  BOOLEAN DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  due_date      DATE,
  due_time      TIME,
  priority      SMALLINT DEFAULT 0 CHECK (priority IN (0, 1, 2)),
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  recurrence    JSONB DEFAULT NULL,
  is_deleted    BOOLEAN DEFAULT FALSE,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_todos_user_date ON todos(user_id, due_date) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_todos_user_completed ON todos(user_id, is_completed, due_date) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_todos_user_category ON todos(user_id, category_id) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_todos_updated ON todos(updated_at);

-- 3. Daily Focus
CREATE TABLE IF NOT EXISTS daily_focus (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  todo_id     UUID REFERENCES todos(id) ON DELETE CASCADE,
  focus_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  slot_order  SMALLINT NOT NULL CHECK (slot_order BETWEEN 1 AND 5),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, focus_date, slot_order),
  UNIQUE(user_id, focus_date, todo_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_focus_user_date ON daily_focus(user_id, focus_date);

-- 4. User Settings
CREATE TABLE IF NOT EXISTS user_settings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme                 TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  daily_focus_count     SMALLINT DEFAULT 3 CHECK (daily_focus_count BETWEEN 1 AND 5),
  daily_reminder        BOOLEAN DEFAULT FALSE,
  reminder_time         TIME DEFAULT '09:00',
  auto_delete_days      INTEGER DEFAULT 30,
  start_screen          TEXT DEFAULT 'today' CHECK (start_screen IN ('today', 'all')),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Streaks
CREATE TABLE IF NOT EXISTS streaks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_date     DATE NOT NULL,
  todos_completed INTEGER DEFAULT 0,
  todos_total     INTEGER DEFAULT 0,
  focus_completed INTEGER DEFAULT 0,
  focus_total     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, streak_date)
);

CREATE INDEX IF NOT EXISTS idx_streaks_user_date ON streaks(user_id, streak_date DESC);

-- ========================================
-- RLS Policies
-- ========================================

-- Todos
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos"
  ON todos FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE USING (auth.uid() = user_id);

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own categories"
  ON categories FOR ALL USING (auth.uid() = user_id);

-- Daily Focus
ALTER TABLE daily_focus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own daily_focus"
  ON daily_focus FOR ALL USING (auth.uid() = user_id);

-- User Settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings"
  ON user_settings FOR ALL USING (auth.uid() = user_id);

-- Streaks
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own streaks"
  ON streaks FOR ALL USING (auth.uid() = user_id);

-- ========================================
-- Updated_at trigger
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
