-- migrate:up
CREATE TABLE users (
  id              INT NOT NULL AUTO_INCREMENT,
  user_name       VARCHAR(100) NOT NULL,
  email           VARCHAR(100) NOT NULL,
  student_index           VARCHAR(100) NULL,
  created_at      TIMESTAMP NULL,
  updated_at      TIMESTAMP NULL,
  PRIMARY KEY (id),
  FULLTEXT INDEX(user_name),
  FULLTEXT INDEX(email),
  FULLTEXT INDEX(student_index)
);

-- migrate:down

DROP TABLE IF EXISTS users;
