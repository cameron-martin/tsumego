DROP INDEX puzzle_ratings_puzzle_id_idx;
DROP INDEX user_ratings_user_id_idx;

CREATE INDEX ON puzzle_ratings (puzzle_id, rated_at);
CREATE INDEX ON user_ratings (user_id, rated_at);