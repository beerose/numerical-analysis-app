-- migrate:up
ALTER TABLE `users`
ADD COLUMN `password` varchar(255) NULL,
ADD `active_user` int(1) GENERATED ALWAYS AS(IF(`password` IS NULL,  0, 1)) VIRTUAL;

-- migrate:down
ALTER TABLE `users`
DROP COLUMN `password` varchar,
DROP COLUMN `active_user`;
