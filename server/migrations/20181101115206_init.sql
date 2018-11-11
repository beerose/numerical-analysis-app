-- migrate:up
CREATE TABLE users (
  id              INT NOT NULL AUTO_INCREMENT,
  user_name       VARCHAR(100) NOT NULL,
  email           VARCHAR(100) NOT NULL,
  student_index   VARCHAR(100) NULL,
  user_role       VARCHAR(50) NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  course_group    VARCHAR(10),
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  INDEX(user_role),
  FULLTEXT INDEX(user_name),
  FULLTEXT INDEX(email),
  FULLTEXT INDEX(student_index)
);

-- migrate:down
DROP TABLE IF EXISTS users;
