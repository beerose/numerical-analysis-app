-- migrate:up

DROP TABLE user_was_active_in_meeting;
DROP TABLE user_attended_meeting;

CREATE TABLE user_attended_meeting (
  user_id INT NOT NULL REFERENCES users(id),
  meeting_id INT NOT NULL REFERENCES meetings(id),
  points INT DEFAULT 0,
  UNIQUE KEY(user_id, meeting_id)
);

ALTER TABLE user_belongs_to_group
	ADD COLUMN grade INT;
-- migrate:down
