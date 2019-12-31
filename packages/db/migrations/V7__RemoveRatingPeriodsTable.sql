DROP TABLE user_ratings;
DROP TABLE puzzle_ratings;
DROP TABLE rating_periods;

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    mean REAL NOT NULL,
    deviation REAL NOT NULL,
    rated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX ON ratings (rated_at);

CREATE TABLE user_ratings (
    user_id UUID NOT NULL
) INHERITS (ratings);

CREATE INDEX ON user_ratings (user_id);

CREATE TABLE puzzle_ratings (
    puzzle_id INTEGER NOT NULL REFERENCES puzzles(id)
) INHERITS (ratings);

CREATE INDEX ON puzzle_ratings (puzzle_id);
