CREATE OR REPLACE FUNCTION glicko_q() RETURNS double precision AS $$
    SELECT ln(10.0::double precision) / 400.0 AS result;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION glicko_g(deviation double precision) RETURNS double precision AS $$
    SELECT 1.0 / sqrt(1 + (3 * pow(glicko_q(), 2) * pow(deviation, 2)) / pow(pi(), 2)) AS result;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION glicko_win_probability(
    puzzle_mean double precision,
    puzzle_deviation double precision,
    user_mean double precision,
    user_deviation double precision
) RETURNS double precision AS $$
    SELECT 1.0 / (1 + pow(10, -glicko_g(user_deviation - puzzle_deviation) * (user_mean - puzzle_mean) / 400.0)) AS result;
$$ LANGUAGE SQL;
