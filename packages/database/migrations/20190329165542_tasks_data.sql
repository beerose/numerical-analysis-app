-- migrate:up
ALTER TABLE tasks
	ADD data json;

-- migrate:down
ALTER TABLE tasks DROP data;

