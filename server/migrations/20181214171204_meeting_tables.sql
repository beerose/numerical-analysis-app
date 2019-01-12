-- migrate:up
CREATE TABLE meetings (
  id              INT NOT NULL AUTO_INCREMENT,
  meeting_name    VARCHAR(200) NOT NULL,
  date            DATE,
  group_id        INT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE
);

CREATE TABLE user_attended_in_meeting (
  user_id INT NOT NULL REFERENCES users(id),
  meeting_id INT NOT NULL REFERENCES meetings(id),
  UNIQUE KEY(user_id, meeting_id)
);

CREATE TABLE user_was_active_in_meeting (
  user_id INT NOT NULL REFERENCES users(id),
  meeting_id INT NOT NULL REFERENCES meetings(id),
  points VARCHAR(10) NOT NULL,
  UNIQUE KEY(user_id, meeting_id)
);

-- migrate:down
DROP TABLE IF EXISTS meetings;
DROP TABLE IF EXISTS user_attended_in_meeting;
DROP TABLE IF EXISTS user_was_active_in_meeting;
