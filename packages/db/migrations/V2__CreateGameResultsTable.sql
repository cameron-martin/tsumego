CREATE TABLE game_results (
    id SERIAL PRIMARY KEY,
    puzzle_id VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    user_won BOOLEAN NOT NULL,
    played_at TIMESTAMPTZ NOT NULL
);
