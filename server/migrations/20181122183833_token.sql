-- migrate:up
CREATE TABLE token
(
  id INT NOT NULL
  AUTO_INCREMENT,
  token       VARCHAR
  (500) NOT NULL,
  PRIMARY KEY
  (id),
  INDEX
  (token)
);

  -- migrate:down
  DROP TABLE IF EXISTS token;
