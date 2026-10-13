CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  groom TEXT NOT NULL,
  bride TEXT NOT NULL,
  wedding_date TEXT NOT NULL,
  payload TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS applications_status_created ON applications(status, created_at);
