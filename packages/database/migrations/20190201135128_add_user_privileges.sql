-- migrate:up
ALTER TABLE `users`
ADD `privileges` JSON;

-- migrate:down
ALTER TABLE `users`
DROP `privileges`;
