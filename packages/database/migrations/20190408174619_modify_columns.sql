-- migrate:up
alter table user_belongs_to_group modify column grade DECIMAL
(16,1);
alter table user_has_points modify COLUMN points DECIMAL
(16,1);

-- migrate:down

