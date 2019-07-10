-- migrate:up

CREATE TABLE tasks (
  id                  INT NOT NULL AUTO_INCREMENT,
  name                VARCHAR(100),
  kind                VARCHAR(20) NOT NULL,
  max_points          INT NOT NULL,
  results_date        TIMESTAMP NOT NULL,
  description         TEXT,
  verify_upload       TINYINT(1) NOT NULL DEFAULT 1,
  start_upload_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_upload_date     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE group_has_task (
  group_id  INT NOT NULL REFERENCES `groups`(id),
  task_id   INT NOT NULL REFERENCES tasks(id),
  weight    INT NOT NULL DEFAULT 1,
  UNIQUE KEY(task_id, group_id)
);

-- migrate:down

DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS group_has_task;
