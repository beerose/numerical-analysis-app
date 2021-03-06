-- migrate:up

CREATE TABLE user_belongs_to_group (
  user_id INT NOT NULL REFERENCES users(id),
  group_id INT NOT NULL REFERENCES `groups`(id),
  UNIQUE KEY(user_id, group_id)
);

-- migrate:down

DROP TABLE IF EXISTS user_belongs_to_group;
