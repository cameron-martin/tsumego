CREATE TABLE rating_periods (
    id SERIAL PRIMARY KEY,
    rated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE user_ratings (
    user_id INTEGER NOT NULL REFERENCES users(id),
    rating_period_id INTEGER NOT NULL REFERENCES rating_periods(id),
    mean REAL NOT NULL,
    deviation REAL NOT NULL,
    PRIMARY KEY (user_id, rating_period_id)
);

CREATE TABLE puzzle_ratings (
    puzzle_id INTEGER NOT NULL REFERENCES puzzles(id),
    rating_period_id INTEGER NOT NULL REFERENCES rating_periods(id),
    mean REAL NOT NULL,
    deviation REAL NOT NULL,
    PRIMARY KEY (puzzle_id, rating_period_id)
);
