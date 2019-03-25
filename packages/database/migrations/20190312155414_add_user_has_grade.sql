-- migrate:up
CREATE TABLE user_has_points (
  user_id  INT NOT NULL REFERENCES users(id),
  task_id  INT NOT NULL REFERENCES tasks(id),
  points   INT NOT NULL DEFAULT 0,
  UNIQUE KEY(user_id, task_id)
);

CREATE TABLE user_has_final_grade (
  user_id INT NOT NULL REFERENCES users(id),
  group_id INT NOT NULL REFERENCES `groupd`(id),
  grade INT
);

CREATE VIEW user_activities_and_presences AS SELECT
	uam.user_id,
	count(uam.meeting_id) AS presences,
	sum(uwa.points) AS activity,
	m.group_id
FROM
	user_attended_in_meeting uam
	LEFT JOIN user_was_active_in_meeting uwa ON (uam.user_id = uwa.user_id AND uam.meeting_id = uwa.meeting_id)
	JOIN meetings m on (uam.meeting_id = m.id)
	GROUP BY
		uam.user_id, m.group_id;

-- migrate:down
DROP TABLE user_has_points;
DROP TABLE user_has_final_grade;


