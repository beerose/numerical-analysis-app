-- migrate:up
CREATE TABLE user_has_points (
  user_id  INT NOT NULL REFERENCES users(id),
  task_id  INT NOT NULL REFERENCES tasks(id),
  points   INT NOT NULL DEFAULT 0,
  UNIQUE KEY(user_id, task_id)
);

-- migrate:down
DROP TABLE user_has_points;
