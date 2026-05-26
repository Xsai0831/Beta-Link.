-- プロジェクトテーブル
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  tags text[] default '{}',
  keywords text default '',        -- 自由記述キーワード（検索用）
  type text default 'open',        -- 'open' | 'matching'
  target_count int default 20,
  current_count int default 0,
  status text default 'active',    -- 'active' | 'closed'
  created_at timestamptz default now()
);

-- すでにテーブルがある場合はこちらを SQL Editor で実行：
-- alter table projects add column if not exists keywords text default '';

alter table projects enable row level security;
create policy "誰でも閲覧可" on projects for select using (true);
create policy "自分のプロジェクトのみ投稿" on projects for insert with check (auth.uid() = user_id);
create policy "自分のプロジェクトのみ更新" on projects for update using (auth.uid() = user_id);
create policy "自分のプロジェクトのみ削除" on projects for delete using (auth.uid() = user_id);

-- テスト履歴テーブル
create table if not exists test_history (
  id uuid default gen_random_uuid() primary key,
  tester_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null,
  feedback text,
  credits_earned int default 2,
  created_at timestamptz default now()
);

alter table test_history enable row level security;
create policy "自分の履歴のみ閲覧" on test_history for select using (auth.uid() = tester_id);
create policy "自分の履歴のみ追加" on test_history for insert with check (auth.uid() = tester_id);
