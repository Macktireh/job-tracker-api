DROP TABLE IF EXISTS jobs;
CREATE TABLE IF NOT EXISTS jobs (
  id integer PRIMARY KEY AUTOINCREMENT,
  url text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  company text NOT NULL,
  location text,
  logo text,
  status text NOT NULL,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_jobs_post_id ON jobs (id);