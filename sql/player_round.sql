CREATE OR REPLACE VIEW "public"."player_round" AS
 WITH
 course_info AS (
     SELECT hole.course_id,
        count(*) AS num_holes,
        sum(hole.par) AS par_total
       FROM hole
      GROUP BY hole.course_id
  ),
  _player_rounds AS (
     SELECT score.round_id,
        score.player_id,
        score.course_id,
        CASE
          WHEN (count(score.score) = course_info.num_holes) THEN sum(score.score)
          ELSE NULL::bigint
        END AS score,
        SUM(hole.par) AS par,
        CASE
          WHEN (count(score.score) = course_info.num_holes) THEN (sum(score.score) - sum(hole.par))
          ELSE NULL::bigint
        END AS relative_score,
        sum(skins.winnings) AS skins_winnings,
        (count(score.score) = course_info.num_holes) AS complete,
        (sum(score.score) - sum(hole.par)) AS raw_relative_score
       FROM
          score
          JOIN hole ON score.hole_number = hole.number
          JOIN course_info ON score.course_id = course_info.course_id AND hole.course_id = course_info.course_id
          LEFT JOIN skins ON
             (
               (score.round_id = skins.round_id) AND
               (score.player_id = skins.player_id) AND
               (score.hole_number = skins.hole_number)
             )
      GROUP BY score.round_id, score.player_id, score.course_id, course_info.num_holes
    )


 SELECT pr.round_id,
    pr.player_id,
    pr.course_id,
    pr.score,
    pr.par,
    pr.relative_score,
    pr.skins_winnings,
    pr.complete,
    (rbp.round_bounty_player AND (tw.tiebreak_winner OR ((round.round_bounty_tiebreak_winner_id IS NULL) AND (1 = row_number() OVER round_w)))) AS round_bounty_winner,
        CASE
            WHEN rbp.round_bounty_player THEN (round.round_bounty * (
            CASE
                WHEN (tw.tiebreak_winner OR ((round.round_bounty_tiebreak_winner_id IS NULL) AND (1 = row_number() OVER round_w))) THEN (array_length(round.round_bounty_player_ids, 1) - 1)
                ELSE '-1'::integer
            END)::numeric)
            ELSE NULL::numeric
        END AS round_winnings,
        CASE
            WHEN rbp.round_bounty_player THEN (COALESCE(pr.skins_winnings, (0)::numeric) + (round.round_bounty * (
            CASE
                WHEN (tw.tiebreak_winner OR ((round.round_bounty_tiebreak_winner_id IS NULL) AND (1 = row_number() OVER round_w))) THEN (array_length(round.round_bounty_player_ids, 1) - 1)
                ELSE '-1'::integer
            END)::numeric))
            ELSE pr.skins_winnings
        END AS total_winnings,
    rank() OVER course_w AS course_rank,
    rank() OVER player_w AS player_course_rank,
    (1 = rank() OVER round_w) AS winner,
    pr.raw_relative_score
   FROM _player_rounds pr,
    round,
    LATERAL ( SELECT (pr.player_id = ANY (round.round_bounty_player_ids)) AS round_bounty_player) rbp,
    LATERAL ( SELECT ((round.round_bounty_tiebreak_winner_id IS NOT NULL) AND (round.round_bounty_tiebreak_winner_id = pr.player_id)) AS tiebreak_winner) tw
  WHERE (pr.round_id = round.id)
  WINDOW round_w AS (PARTITION BY pr.round_id ORDER BY pr.score), course_w AS (PARTITION BY pr.course_id ORDER BY pr.score), player_w AS (PARTITION BY pr.course_id, pr.player_id ORDER BY pr.score);