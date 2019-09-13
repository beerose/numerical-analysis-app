-- migrate:up
DROP TABLE IF EXISTS `file_meta`;
CREATE TABLE `file_meta` (
  filepath VARCHAR(300) NOT NULL,
  uploaded_by INT NOT NULL,
  meta JSON DEFAULT NULL,
  PRIMARY KEY (filepath),
  FOREIGN KEY (uploaded_by) REFERENCES `users`(id),
  FULLTEXT INDEX(filepath)
);
-- migrate:down
DROP TABLE IF EXISTS `file_meta`;
