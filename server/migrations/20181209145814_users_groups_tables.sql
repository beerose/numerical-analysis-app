-- migrate:up

CREATE TABLE user_teaches_in_group (
  user_id VARCHAR(100) NOT NULL REFERENCES users(id),
  group_id VARCHAR(100) NOT NULL REFERENCES `groups`(id),
  UNIQUE KEY(user_id, group_id)
);

CREATE TABLE user_belongs_to_group (
  user_id VARCHAR(100) NOT NULL REFERENCES users(id),
  group_id VARCHAR(100) NOT NULL REFERENCES `groups`(id),
  UNIQUE KEY(user_id, group_id)
);

-- migrate:down

DROP TABLE IF EXISTS user_teaches_in_group;
DROP TABLE IF EXISTS user_belongs_to_group;
