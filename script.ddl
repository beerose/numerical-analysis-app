-- Exported from QuickDBD: https://www.quickdatatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/lZ5Gp8
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE `group_has_task` (
    `group_id` int(11)  NOT NULL ,
    `task_id` int(11)  NOT NULL ,
    `weight` int(11)  NULL ,

    CONSTRAINT `uc_group_has_task_group_id` UNIQUE (
        `group_id`
    ),
    CONSTRAINT `uc_group_has_task_task_id` UNIQUE (
        `task_id`
    )
);

CREATE TABLE `groups` (
    `id` int(11) AUTO_INCREMENT NOT NULL ,
    `group_name` varchar(200)  NOT NULL ,
    `group_type` varchar(50)  NOT NULL ,
    `parent_group` int(11)  NULL ,
    `data` json  NULL ,
    `created_at` timestamp  NOT NULL DEFAULT current_timestamp,
    `updated_at` timestamp  NOT NULL DEFAULT current_timestamp,
    `lecturer_id` int(11)  NULL ,
    `class_number` varchar(50)  NULL ,
    `semester` varchar(50)  NULL ,
    PRIMARY KEY (
        `id`
    )
);

-- `group_name` FULLTEXT KEY NULL
CREATE TABLE `meetings` (
    `id` int(11) AUTO_INCREMENT NOT NULL ,
    `meeting_name` varchar(200)  NOT NULL ,
    `date` date  NULL ,
    `group_id` int(11)  NULL ,
    `created_at` timestamp  NOT NULL DEFAULT current_timestamp,
    `updated_at` timestamp  NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `tasks` (
    `id` int(11) AUTO_INCREMENT NOT NULL ,
    `name` varchar(100)  NULL ,
    `kind` varchar(20)  NOT NULL ,
    `max_points` int(11)  NOT NULL ,
    `results_date` timestamp  NOT NULL DEFAULT current_timestamp,
    -- COLLATE
    `description` text  NULL ,
    `verify_upload` tinyint(1)  NOT NULL DEFAULT '1',
    `start_upload_date` timestamp  NOT NULL DEFAULT current_timestamp,
    `end_upload_date` timestamp  NOT NULL DEFAULT current_timestamp,
    `created_at` timestamp  NOT NULL DEFAULT current_timestamp,
    `updated_at` timestamp  NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `user_attended_in_meeting` (
    `user_id` varchar(100)  NOT NULL ,
    `meeting_id` varchar(100)  NOT NULL ,

    CONSTRAINT `uc_user_attended_in_meeting_user_id` UNIQUE (
        `user_id`
    ),
    CONSTRAINT `uc_user_attended_in_meeting_meeting_id` UNIQUE (
        `meeting_id`
    )
);

CREATE TABLE `user_belongs_to_group` (
    `user_id` varchar(100)  NOT NULL ,
    `group_id` varchar(100)  NOT NULL ,

    CONSTRAINT `uc_user_belongs_to_group_user_id` UNIQUE (
        `user_id`
    ),
    CONSTRAINT `uc_user_belongs_to_group_group_id` UNIQUE (
        `group_id`
    )
);

CREATE TABLE `user_was_active_in_meeting` (
    `user_id` varchar(100)  NOT NULL ,
    `meeting_id` varchar(100)  NOT NULL ,
    `points` varchar(10)  NOT NULL ,

    CONSTRAINT `uc_user_was_active_in_meeting_user_id` UNIQUE (
        `user_id`
    ),
    CONSTRAINT `uc_user_was_active_in_meeting_meeting_id` UNIQUE (
        `meeting_id`
    )
);

CREATE TABLE `users` (
    `id` int(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_name` varchar(100)  NOT NULL ,
    `email` varchar(100)  NOT NULL ,
    `student_index` varchar(20)  NULL DEFAULT '',
    `user_role` varchar(50)  NOT NULL ,
    `created_at` timestamp  NOT NULL DEFAULT current_timestamp,
    `updated_at` timestamp  NOT NULL DEFAULT current_timestamp,
    `course_group` varchar(10)  NULL ,
    `password` varchar(255)  NULL ,
    `active_user` int(1)  NULL
);

ALTER TABLE `group_has_task` ADD CONSTRAINT `fk_group_has_task_group_id` FOREIGN KEY(`group_id`)
REFERENCES `groups` (`id`);

ALTER TABLE `group_has_task` ADD CONSTRAINT `fk_group_has_task_task_id` FOREIGN KEY(`task_id`)
REFERENCES `tasks` (`id`);

ALTER TABLE `meetings` ADD CONSTRAINT `fk_meetings_group_id` FOREIGN KEY(`group_id`)
REFERENCES `groups` (`id`);

ALTER TABLE `user_attended_in_meeting` ADD CONSTRAINT `fk_user_attended_in_meeting_user_id` FOREIGN KEY(`user_id`)
REFERENCES `users` (`id`);

ALTER TABLE `user_attended_in_meeting` ADD CONSTRAINT `fk_user_attended_in_meeting_meeting_id` FOREIGN KEY(`meeting_id`)
REFERENCES `meetings` (`id`);

ALTER TABLE `user_belongs_to_group` ADD CONSTRAINT `fk_user_belongs_to_group_user_id` FOREIGN KEY(`user_id`)
REFERENCES `users` (`id`);

ALTER TABLE `user_belongs_to_group` ADD CONSTRAINT `fk_user_belongs_to_group_group_id` FOREIGN KEY(`group_id`)
REFERENCES `groups` (`id`);

ALTER TABLE `user_was_active_in_meeting` ADD CONSTRAINT `fk_user_was_active_in_meeting_user_id` FOREIGN KEY(`user_id`)
REFERENCES `users` (`id`);

ALTER TABLE `user_was_active_in_meeting` ADD CONSTRAINT `fk_user_was_active_in_meeting_meeting_id` FOREIGN KEY(`meeting_id`)
REFERENCES `meetings` (`id`);

CREATE INDEX `idx_groups_parent_group`
ON `groups` (`parent_group`);

CREATE INDEX `idx_meetings_group_id`
ON `meetings` (`group_id`);

