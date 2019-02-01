-- migrate:up

ALTER TABLE `groups` ADD lecturer_id INT REFERENCES `users`(id) ON DELETE CASCADE;

-- migrate:down

ALTER TABLE `groups` DROP lecturer_id;

