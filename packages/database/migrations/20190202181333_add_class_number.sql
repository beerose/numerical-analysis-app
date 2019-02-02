-- migrate:up

ALTER TABLE `groups` ADD class_number VARCHAR(50); -- it can be a string containing some info

-- migrate:down

ALTER TABLE `groups` DROP class_number;

