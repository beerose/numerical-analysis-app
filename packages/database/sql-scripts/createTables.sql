
--
-- Table structure for table `group_has_task`
--

DROP TABLE IF EXISTS `group_has_task`;
CREATE TABLE `group_has_task` (
  `group_id` int(11) NOT NULL REFERENCES `groups`(id) ON DELETE CASCADE,
  `task_id` int(11) NOT NULL REFERENCES `tasks`(id) ON DELETE CASCADE,
  `weight` int(11) DEFAULT NULL,
  UNIQUE KEY `task_id` (`task_id`,`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_group` int(11) DEFAULT NULL,
  `data` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lecturer_id` int(11) DEFAULT NULL,
  `class_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `semester` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_group` (`parent_group`),
  FULLTEXT KEY `group_name` (`group_name`),
  CONSTRAINT `groups_ibfk_2` FOREIGN KEY (`parent_group`) REFERENCES `groups` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `meetings`
--

DROP TABLE IF EXISTS `meetings`;
CREATE TABLE `meetings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meeting_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `meetings_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kind` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_points` int(11) NOT NULL,
  `results_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` text COLLATE utf8mb4_unicode_ci,
  `verify_upload` tinyint(1) NOT NULL DEFAULT '1',
  `start_upload_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_upload_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `data` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `user_attended_meeting`
--

DROP TABLE IF EXISTS `user_attended_meeting`;
CREATE TABLE `user_attended_meeting` (
  `user_id` int(11) NOT NULL,
  `meeting_id` int(11) NOT NULL,
  `points` int(11) DEFAULT '0',
  UNIQUE KEY `user_id` (`user_id`,`meeting_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `user_belongs_to_group`
--

DROP TABLE IF EXISTS `user_belongs_to_group`;
CREATE TABLE `user_belongs_to_group` (
  `user_id` int(11) DEFAULT NULL REFERENCES users(id) ON DELETE CASCADE,
  `group_id` int(11) DEFAULT NULL REFERENCES `groups`(id) ON DELETE CASCADE,
  `grade` decimal(16,1) DEFAULT NULL,
  UNIQUE KEY `user_id` (`user_id`,`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `user_has_points`
--

DROP TABLE IF EXISTS `user_has_points`;
CREATE TABLE `user_has_points` (
  `user_id` int(11) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  `task_id` int(11) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  `points` decimal(16,1) DEFAULT NULL,
  UNIQUE KEY `user_id` (`user_id`,`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active_user` int(1) GENERATED ALWAYS AS (if(isnull(`password`),0,1)) VIRTUAL,
  `privileges` json DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_index` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `user_role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_role` (`user_role`),
  FULLTEXT KEY `user_name` (`user_name`),
  FULLTEXT KEY `email` (`email`),
  FULLTEXT KEY `student_index` (`student_index`)
) ENGINE=InnoDB AUTO_INCREMENT=566 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
