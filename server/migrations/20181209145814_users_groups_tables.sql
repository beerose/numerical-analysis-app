-- migrate:up

CREATE TABLE user_teaches_in_group (
  user_id VARCHAR(100) REFERENCES users(id),
  group_id VARCHAR(100) REFERENCES groups(id)
);

CREATE TABLE user_belongs_to_group (
  user_id VARCHAR(100) REFERENCES users(id),
  group_id VARCHAR(100) REFERENCES users(id)
);

-- migrate:down

DROP TABLE ID EXISTS user_teaches_in_group;
DROP TABLE ID EXISTS user_belongs_to_group;
