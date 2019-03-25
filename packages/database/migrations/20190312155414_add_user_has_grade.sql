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

-- migrate:down
DROP TABLE user_has_points;
DROP TABLE user_has_final_grade;


